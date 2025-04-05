import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragAndDrop } from './step/drag-drop';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useUploadHandler } from '@/hooks/use-upload-handler';
import documentService from '@/service/service';
import { formatToOpenAttestation, parseFromOpenAttestation, validateDocumentHash } from '@/service/document-formater';
import Loading from '@/components/ui/loading';

const TradeTrustDocumentHandler: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  
  const {
    uploadedFile,
    error,
    progress,
    uploading,
    fileAccept,
    onDragAndDrop,
    rejectedFile,
    removeFileUpload,
  } = useUploadHandler('Verifiable');

  const handleVerifyDocument = async () => {
    if (!uploadedFile) return;
    
    try {
      setVerificationStatus('loading');
      setVerificationError(null);
      
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(uploadedFile);
      });
      
      let parsedDocument;
      try {
        parsedDocument = JSON.parse(fileContent);
      } catch (error) {
        throw new Error('Invalid document format. File must be a valid JSON.');
      }
      
      const isTradeTrust = parsedDocument.version === 'https://schema.openattestation.com/2.0/schema.json';
      
      if (!isTradeTrust) {
        console.log('Not a valid OpenAttestation document');
        throw new Error('Not a valid OpenAttestation document. Document must follow the OpenAttestation schema.');
      }
      
      setDocumentData(parsedDocument);
      
      const result = await documentService.verifyTradeTrustDocument(parsedDocument);
      console.log('Verification result:', result);
      setVerificationResult(result);
      
      if (result.error) {
        console.error('Verification error:', result.error);
        setVerificationError(result.error);
        setVerificationStatus('error');
      } else {
        setVerificationStatus(result.verified ? 'success' : 'error');
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      setVerificationError(error instanceof Error ? error.message : 'Failed to verify document');
      setVerificationStatus('error');
    }
  };

  const renderVerificationResults = () => {
    if (verificationStatus === 'loading') {
      return (
        <div className="mt-5 flex flex-col items-center justify-center">
          <Loading className="h-12 w-12 mb-3" />
          <p className="text-lg">Verifying document...</p>
        </div>
      );
    }
    
    if (verificationStatus === 'error') {
      return (
        <Alert variant="destructive" className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            {verificationError || 'An error occurred during verification'}
          </AlertDescription>
          <div className="mt-2 text-xs bg-red-50 p-2 rounded">
            <p>Debug info: Please check the browser console for detailed error logs.</p>
            <p>If you're still encountering issues, the document might not be properly registered on the blockchain.</p>
          </div>
        </Alert>
      );
    }
    
    if (verificationStatus === 'success' && verificationResult) {
      const standard = parseFromOpenAttestation(documentData);
      
      return (
        <div className="mt-5">
          <Alert variant={verificationResult.verified ? 'success' : 'destructive'}>
            {verificationResult.verified ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {verificationResult.verified ? 'Document Verified' : 'Verification Failed'}
            </AlertTitle>
            <AlertDescription>
              {verificationResult.verified 
                ? 'This document has been successfully verified.'
                : verificationResult.error || 'This document could not be verified on the blockchain.'}
            </AlertDescription>
            {!verificationResult.verified && (
              <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                <p>Verification details:</p>
                <ul className="list-disc pl-4 mt-1">
                  <li>In database: {verificationResult.verification?.inDatabase ? 'Yes' : 'No'}</li>
                  <li>On blockchain: {verificationResult.verification?.onBlockchain ? 'Yes' : 'No'}</li>
                  {verificationResult.errorDetails && (
                    <li>Error: {JSON.stringify(verificationResult.errorDetails)}</li>
                  )}
                </ul>
              </div>
            )}
          </Alert>
          
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Document Type</h3>
                  <p>{standard.metadata.documentType || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="font-medium">BL Number</h3>
                  <p>{standard.metadata.blNumber || 'N/A'}</p>
                </div>
                {standard.metadata.shipperName && (
                  <div>
                    <h3 className="font-medium">Shipper</h3>
                    <p>{standard.metadata.shipperName}</p>
                  </div>
                )}
                {standard.metadata.consigneeName && (
                  <div>
                    <h3 className="font-medium">Consignee</h3>
                    <p>{standard.metadata.consigneeName}</p>
                  </div>
                )}
                {standard.metadata.vessel && (
                  <div>
                    <h3 className="font-medium">Vessel</h3>
                    <p>{standard.metadata.vessel}</p>
                  </div>
                )}
                {standard.documentHash && (
                  <div className="col-span-2">
                    <h3 className="font-medium">Document Hash</h3>
                    <p className="break-all text-xs">{standard.documentHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Verify TradeTrust Document</CardTitle>
        </CardHeader>
        <CardContent>
          <DragAndDrop
            desc="Drag & drop or click to upload your TradeTrust document (.tt file)"
            formatFile=".tt"
            error={error}
            uploading={uploading}
            progress={progress}
            uploadedFile={uploadedFile}
            onDragAndDrop={onDragAndDrop}
            rejectedFiles={rejectedFile}
            removeFile={removeFileUpload}
            fileAccept={{ 'application/json': ['.tt', '.json'] }}
          />
          
          {uploadedFile && progress === 100 && !uploading && (
            <div className="mt-5 flex justify-center">
              <Button 
                onClick={handleVerifyDocument}
                disabled={verificationStatus === 'loading'}
              >
                {verificationStatus === 'loading' ? (
                  <>
                    <Loading className="mr-2 h-4 w-4" />
                    Verifying...
                  </>
                ) : 'Verify Document'}
              </Button>
            </div>
          )}
          
          {renderVerificationResults()}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeTrustDocumentHandler;