import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { UploadFiles } from '@/types/general-type'
import { SelectTypeDocument } from './step/select-type-document'
import { NameDocument } from './step/name-document'
import { DownloadDocument } from './step/download-document'
import { DragAndDrop } from './step/drag-drop'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useUploadHandler } from '@/hooks/use-upload-handler'
import { cn } from '../../lib/utils'
import { DocumentView } from './document-view'
import { useNavigate } from 'react-router-dom'
import documentService from '@/service/service'
import Loading from '../ui/loading'

export function UploadFile({
  desc,
  formatFile,
  mode,
  selectedExchange,
  alertView,
  setAlertView,
}: UploadFiles) {
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
  } = useUploadHandler(mode === 'Transferable' || mode === 'Verifiable' ? mode : 'Create');

  const [step, setStep] = useState<number>(1)
  const [selected, setSelectTypeDoc] = useState<string>('')
  const [alert, setAlert] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [verifyMode, setVerifyMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)

  const navigate = useNavigate()

  // Reset to initial step
  function handleToDashboard() {
    setFileName('')
    setStep(1)
    removeFileUpload()
    setSelectTypeDoc('')
    setAlert(false)
    setJobId(null)
    setJobStatus(null)
    setCreateError(null)
  }

  // Poll job status when jobId is available
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    if (jobId && (jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed')) {
      // Poll every 3 seconds
      intervalId = setInterval(async () => {
        try {
          const status = await documentService.checkJobStatus(jobId, 'creation');
          setJobStatus(status.state);
          
          // If complete, get document details
          if (status.state === 'completed') {
            if (status.result && status.result.document) {
              setDocumentId(status.result.document._id || status.result.document.id);
            }
            if (intervalId !== null) {
              clearInterval(intervalId);
            }
          }
          
          // If failed, show error
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

  // Handle next step button click
  async function nextStep() {
    // Verify mode - check exchange selection
    if (mode === 'Verifiable' && step === 1 && !selectedExchange) {
      setAlertView?.(true)
      return
    }
    
    // Validation checks for document type and name
    if ((step === 2 && !selected) || (step === 3 && fileName.trim() === '')) {
      setAlert(true)
      return
    }

    setAlert(false)
    setAlertView?.(false)
    setCreateError(null)

    // Create document when on the name input step
    if (mode === 'Create' && step === 3) {
      try {
        setIsSubmitting(true)

        // Create document with file data
        const docType = selected === 'transferable' ? 'Transferable' : 'Verifiable';
        
        const res = await documentService.createDocument({
          type: docType as 'Transferable' | 'Verifiable',
          metadata: createFile?.metadata || {},
          fileName: fileName,
        });

        // Save the job ID for status checking
        if (res.job && res.job.id) {
          setJobId(res.job.id);
          setJobStatus('waiting');
        }

        // If document is created immediately without a job, store the document ID
        if (res.document && (res.document._id || res.document.id)) {
          setDocumentId(res.document._id || res.document.id);
        }

        // Move to the download step
        setStep((prev) => prev + 1);
      } catch (error) {
        console.error('Document creation error:', error);
        setCreateError(error instanceof Error ? error.message : 'Document creation failed');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Otherwise just move to the next step
      setStep((prev) => prev + 1);
    }
  }

  // Handle verification mode
  useEffect(() => {
    if (mode === 'Verifiable' && uploadedFile && progress === 100) {
      setVerifyMode(true)
    }
  }, [uploadedFile, progress, mode])

  // Navigate to document viewer for verification
  useEffect(() => {
    if (verifyMode) {
      navigate('/document-viewer')
    }
  }, [verifyMode, navigate])

  return (
    <div
      className={cn(
        `mx-auto flex flex-col items-center justify-center space-y-5 md:w-3/4 lg:mx-0 lg:w-1/2 xl:w-[35%]`,
      )}
    >
      {createError && (
        <Alert className="mb-3 flex items-center gap-3" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {createError}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {step === 1 && (
        <>
          {alertView && mode === 'Verifiable' && !selectedExchange && (
            <Alert
              className="mb-3 flex items-center gap-3"
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  Select Exchange before next step!
                </AlertDescription>
              </div>
            </Alert>
          )}
          <DragAndDrop
            desc={desc}
            formatFile={formatFile}
            error={error}
            uploading={uploading}
            progress={progress}
            uploadedFile={uploadedFile}
            onDragAndDrop={onDragAndDrop}
            rejectedFiles={rejectedFile}
            removeFile={removeFileUpload}
            fileAccept={fileAccept}
          />
        </>
      )}

      {step === 2 && mode === 'Create' && (
        <SelectTypeDocument
          setSelectTypeDoc={setSelectTypeDoc}
          selected={selected}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      {step === 2 && mode === 'Verifiable' && <DocumentView />}

      {step === 3 && mode === 'Create' && (
        <NameDocument
          fileName={fileName}
          uploadedFile={uploadedFile}
          setFileName={setFileName}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      {step === 4 && mode === 'Create' && (
        <>
          {jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed' ? (
            <div className="w-full text-center py-10">
              <Loading className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Creating document...</p>
              <p className="text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : (
            <DownloadDocument
              fileName={`${fileName}.tt`}
              onReset={handleToDashboard}
              alert={alert}
              setAlert={setAlert}
              documentId={documentId}
            />
          )}
        </>
      )}

      <div className="mt-4 flex w-full justify-end gap-8">
        <Button
          variant="outline"
          className="cursor-pointer rounded-lg px-10 py-5 font-normal md:text-base"
          onClick={() => setStep((prev) => prev - 1)}
          disabled={step === 1 || isSubmitting || (jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed')}
        >
          Back
        </Button>

        <Button
          className="cursor-pointer rounded-lg px-10 py-5 font-normal md:text-base"
          onClick={nextStep}
          disabled={
            (step === 1 && (!uploadedFile || uploading || progress < 100)) ||
            step === 4 ||
            isSubmitting ||
            (jobStatus === 'waiting' || jobStatus === 'active' || jobStatus === 'delayed')
          }
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loading className="h-4 w-4" />
              <span>Processing...</span>
            </div>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  )
}