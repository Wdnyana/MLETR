// frontend/src/components/dashboard/TradeTrustDocumentHandler.tsx
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragAndDrop } from './step/drag-drop';
import { AlertCircle, CheckCircle, Calendar, User, AlertTriangle } from 'lucide-react';
import { useUploadHandler } from '@/hooks/use-upload-handler';
import documentService from '@/service/service';
import { formatToOpenAttestation, parseFromOpenAttestation, validateDocumentHash } from '@/service/document-formater';
import Loading from '@/components/ui/loading';

interface VerificationDetail {
  name: string;
  status: 'valid' | 'invalid' | 'skipped';
  message?: string;
  icon: React.ReactNode;
}

const TradeTrustDocumentHandler: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const [verificationDetails, setVerificationDetails] = useState<VerificationDetail[]>([]);
  
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
      setVerificationDetails([]);
      
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
      
      // Process verification details for display
      const details: VerificationDetail[] = [];
      
      // Document integrity
      details.push({
        name: 'Document Integrity',
        status: result.verification?.client?.documentIntegrity ? 'valid' : 'invalid',
        message: result.verification?.client?.documentIntegrity 
          ? 'Document has not been tampered with' 
          : 'Document may have been tampered with',
        icon: result.verification?.client?.documentIntegrity 
          ? <CheckCircle className="h-4 w-4 text-green-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />
      });
      
      // Issuer identity
      details.push({
        name: 'Issuer Identity',
        status: result.verification?.client?.issuerIdentity ? 'valid' : 'invalid',
        message: result.verification?.client?.issuerIdentity 
          ? 'Issuer has been verified' 
          : 'Issuer could not be verified',
        icon: result.verification?.client?.issuerIdentity 
          ? <CheckCircle className="h-4 w-4 text-green-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />
      });
      
      // Blockchain verification
      details.push({
        name: 'Blockchain Record',
        status: result.verification?.blockchain?.onBlockchain ? 'valid' : 'invalid',
        message: result.verification?.blockchain?.onBlockchain 
          ? 'Document is registered on blockchain' 
          : 'Document was not found on blockchain',
        icon: result.verification?.blockchain?.onBlockchain 
          ? <CheckCircle className="h-4 w-4 text-green-500" /> 
          : <AlertCircle className="h-4 w-4 text-red-500" />
      });
      
      // Revocation status
      if (result.verification?.blockchain?.exists) {
        details.push({
          name: 'Revocation Status',
          status: !result.verification?.blockchain?.isRevoked ? 'valid' : 'invalid',
          message: !result.verification?.blockchain?.isRevoked 
            ? 'Document has not been revoked' 
            : 'Document has been revoked',
          icon: !result.verification?.blockchain?.isRevoked 
            ? <CheckCircle className="h-4 w-4 text-green-500" /> 
            : <AlertTriangle className="h-4 w-4 text-red-500" />
        });
        
        // Check expiry
        details.push({
          name: 'Expiry Status',
          status: !result.verification?.blockchain?.isExpired ? 'valid' : 'invalid',
          message: !result.verification?.blockchain?.isExpired 
            ? `Valid until ${new Date(result.verification?.blockchain?.expiryDate).toLocaleDateString()}` 
            : 'Document has expired',
          icon: !result.verification?.blockchain?.isExpired 
            ? <Calendar className="h-4 w-4 text-green-500" /> 
            : <Calendar className="h-4 w-4 text-red-500" />
        });
      }
      
      setVerificationDetails(details);
      
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

  const renderVerificationDetails = () => {
    return (
      <div className="mt-4 space-y-2">
        {verificationDetails.map((detail, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-md flex items-start ${
              detail.status === 'valid' ? 'bg-green-50' : 
              detail.status === 'invalid' ? 'bg-red-50' : 
              'bg-gray-50'
            }`}
          >
            <span className="mr-2 mt-1">{detail.icon}</span>
            <div>
              <h4 className="font-medium">{detail.name}</h4>
              <p className="text-sm text-gray-600">{detail.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Rest of the component remains the same...

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
          
          {verificationStatus === 'loading' && (
            <div className="mt-5 flex flex-col items-center justify-center">
              <Loading className="h-12 w-12 mb-3" />
              <p className="text-lg">Verifying document...</p>
            </div>
          )}
          
          {(verificationStatus === 'success' || verificationStatus === 'error') && (
            <div className="mt-5">
              <Alert variant={verificationStatus === 'success' ? 'success' : 'destructive'}>
                {verificationStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {verificationStatus === 'success' ? 'Document Verified' : 'Verification Failed'}
                </AlertTitle>
                <AlertDescription>
                  {verificationStatus === 'success' 
                    ? 'This document has been successfully verified.' 
                    : verificationError || 'This document could not be verified.'}
                </AlertDescription>
              </Alert>
              
              {/* Show detailed verification results */}
              {renderVerificationDetails()}
              
              {/* Display document details */}
              {documentData && (
                <DocumentDetails document={documentData} result={verificationResult} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface DocumentDetailsProps {
  document: any;
  result: any;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document, result }) => {
  const standard = parseFromOpenAttestation(document);
  
  return (
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
          {result.verification?.blockchain?.exists && (
            <>
              <div>
                <h3 className="font-medium">Issuer</h3>
                <p className="text-xs break-all">{result.verification.blockchain.issuer}</p>
              </div>
              <div>
                <h3 className="font-medium">Current Holder</h3>
                <p className="text-xs break-all">{result.verification.blockchain.currentHolder}</p>
              </div>
            </>
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
  );
};

export default TradeTrustDocumentHandler;