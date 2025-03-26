import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadHandler } from '@/hooks/use-upload-handler';
import { Steps, StepIndicator, StepSeparator, StepStatus, StepTitle, useSteps } from '@/components/ui/steps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragAndDrop } from '@/components/dashboard/step/drag-drop';
import { SelectTypeDocument } from '@/components/dashboard/step/select-type-document';
import DocumentForm from './DocumentForm';
import { DownloadDocument } from '@/components/dashboard/step/download-document';
import documentService from '@/service/service';
import Loading from '@/components/ui/loading';
import { parseDocumentType } from '@/components/utils/document-helpers';

interface DocumentCreatorProps {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const DocumentCreator: React.FC<DocumentCreatorProps> = ({ token, setToken }) => {
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [documentCategory, setDocumentCategory] = useState<'Transferable' | 'Verifiable'>('Transferable');
  const [alert, setAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('document.tt');
  
  const navigate = useNavigate();
  
  const {
    uploadedFile,
    createFile,
    error,
    progress,
    uploading,
    fileAccept,
    onDragAndDrop,
    rejectedFile,
    removeFileUpload,
  } = useUploadHandler('Create');
  
  const steps = [
    { title: 'Upload File' },
    { title: 'Select Document Type' },
    { title: 'Fill Form' },
    { title: 'Download Document' }
  ];
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  useEffect(() => {
    if (createFile?.metadata && activeStep === 0 && progress === 100) {
      setFormData(createFile.metadata);
    }
  }, [createFile, activeStep, progress]);
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    if (jobId && (jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed')) {
      intervalId = setInterval(async () => {
        try {
          const status = await documentService.checkJobStatus(jobId, 'creation');
          setJobStatus(status.state);
          
          if (status.state === 'completed') {
            if (status.result && status.result.document) {
              setDocumentId(status.result.document._id || status.result.document.id);
            }
            if (intervalId !== null) {
              clearInterval(intervalId);
            }
          }
          
            if (status.state === 'failed') {
            setCreateError(status.error || 'Document creation failed');
            if (intervalId !== null) {
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error('Error checking job status:', error);
          setCreateError('Error checking job status. Please try again.');
          if (intervalId !== null) {
            clearInterval(intervalId);
          }
        }
      }, 3000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, jobStatus]);

  useEffect(() => {
    if (selectedDocType && formData) {
      const docTypeName = selectedDocType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const baseFileName = formData.blNumber || formData.documentNumber || `${docTypeName}-Document`;
      setFileName(`${baseFileName}.tt`);
    }
  }, [selectedDocType, formData]);

  const nextStep = async () => {
    if (activeStep === 0 && (!uploadedFile || progress < 100)) {
      setAlert(true);
      return;
    }
    
    if (activeStep === 1 && !selectedDocType) {
      setAlert(true);
      return;
    }
    
    setAlert(false);
    
    if (activeStep < 2) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleCreateDocument = async (data: any) => {
    try {
      setIsSubmitting(true);
      setCreateError(null);
      
      const documentData = {
        type: documentCategory,
        metadata: {
          ...data,
          originalFileName: uploadedFile?.name
        },
        fileName: data.blNumber || data.documentNumber || selectedDocType
      };
      
      const response = await documentService.createDocument(documentData);
      
      if (response.job && response.job.id) {
        setJobId(response.job.id);
        setJobStatus('waiting');
      }
      
      if (response.document && (response.document._id || response.document.id)) {
        setDocumentId(response.document._id || response.document.id);
      }
      
      setActiveStep(3);
      
    } catch (error) {
      console.error('Document creation error:', error);
      setCreateError(error instanceof Error ? error.message : 'Document creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    removeFileUpload();
    setSelectedDocType('');
    setFormData(null);
    setAlert(false);
    setActiveStep(0);
    setJobId(null);
    setJobStatus(null);
    setDocumentId(null);
    setCreateError(null);
  };

  const updateDocumentCategory = (docType: string) => {
    // This is a placeholder logic - in a real implementation,
    // you would have a mapping of which document types are transferable vs verifiable
    const transferableTypes = [
      'bill-of-lading',
      'air-waybill',
      'sea-waybill',
      'warehouse-receipt'
    ];
    
    setDocumentCategory(
      transferableTypes.includes(docType) ? 'Transferable' : 'Verifiable'
    );
  };

  const handleSelectDocType = (docType: string) => {
    setSelectedDocType(docType);
    updateDocumentCategory(docType);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-10">
        <Steps activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {activeStep === 0 && 'Upload Document File'}
            {activeStep === 1 && 'Choose Document Type'}
            {activeStep === 2 && 'Fill Document Form'}
            {activeStep === 3 && 'Download Document'}
          </CardTitle>
          <CardDescription>
            {activeStep === 0 && 'Upload a JSON or CSV file containing your document data'}
            {activeStep === 1 && 'Select the type of document you want to create'}
            {activeStep === 2 && 'Fill in the document details. Fields marked with * are required'}
            {activeStep === 3 && 'Your document has been created successfully'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeStep === 0 && (
            <DragAndDrop
              desc="Drag & drop or click to upload your document data file"
              formatFile=".json, .csv"
              error={error}
              uploading={uploading}
              progress={progress}
              uploadedFile={uploadedFile}
              onDragAndDrop={onDragAndDrop}
              rejectedFiles={rejectedFile}
              removeFile={removeFileUpload}
              fileAccept={fileAccept}
            />
          )}

          {activeStep === 1 && (
            <SelectTypeDocument
              setSelectTypeDoc={handleSelectDocType}
              selected={selectedDocType}
              alert={alert}
              setAlert={setAlert}
            />
          )}

          {activeStep === 2 && (
            <DocumentForm
              documentType={selectedDocType}
              initialData={formData}
              onSubmit={handleCreateDocument}
              isSubmitting={isSubmitting}
              error={createError}
            />
          )}

          {activeStep === 3 && (
            <>
              {jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed' ? (
                <div className="w-full text-center py-10">
                  <Loading className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Creating document...</p>
                  <p className="text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <DownloadDocument
                  fileName={fileName}
                  onReset={handleReset}
                  alert={alert}
                  setAlert={setAlert}
                  documentId={documentId}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {(activeStep < 2 || activeStep === 3) && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={activeStep === 0 ? () => navigate('/dashboard') : () => setActiveStep(prev => prev - 1)}
            disabled={isSubmitting || (jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed')}
          >
            {activeStep === 0 ? 'Back to Dashboard' : 'Previous'}
          </Button>
          
          {activeStep < 2 && (
            <Button
              onClick={nextStep}
              disabled={
                (activeStep === 0 && (!uploadedFile || uploading || progress < 100)) ||
                isSubmitting
              }
            >
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const Step = ({ title }: { title: string }) => {
  return (
    <StepStatus>
      <StepIndicator children={undefined} />
      <StepTitle>{title}</StepTitle>
      <StepSeparator />
    </StepStatus>
  );
};

export default DocumentCreator;