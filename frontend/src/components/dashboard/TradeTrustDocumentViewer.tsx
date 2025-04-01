import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeCheck, AlertCircle, Download, ChevronLeft } from 'lucide-react';
import documentService from '@/service/service';
import Loading from '@/components/ui/loading';
import { parseFromOpenAttestation } from '@/service/document-formater';
import { NFTDocument } from './nft-document';
import { InvoiceDocument } from './invoice-document';

interface DocumentViewerProps {
  documentId?: string;
  documentData?: any;
}

const TradeTrustDocumentViewer: React.FC<DocumentViewerProps> = ({ documentId, documentData: initialData }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<any>(initialData || null);
  const [standardDocument, setStandardDocument] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const id = documentId || params.id;

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id && !documentData) {
        setError('No document ID or data provided');
        setLoading(false);
        return;
      }
      
      if (documentData) {
        try {
          const standard = parseFromOpenAttestation(documentData);
          setDocumentData(documentData);
          setStandardDocument(standard);
          setLoading(false);
        } catch (error) {
          console.error('Error parsing document:', error);
          setError('Failed to parse document data');
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        const response = await documentService.getDocumentDetails(id as string);
        const document = response.document;
        
        const standard = {
          documentType: document.documentType,
          documentHash: document.documentHash,
          metadata: document.metadata,
          createdAt: document.createdAt,
          creator: document.creator
        };
        
        setStandardDocument(standard);
        setDocumentData(standard);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to fetch document');
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id, documentData]);

  const handleVerifyDocument = async () => {
    if (!standardDocument) return;
    
    try {
      setVerificationStatus('loading');
      
      const result = await documentService.verifyTradeTrustDocument(documentData);
      setVerificationStatus(result.verified ? 'success' : 'error');
    } catch (error) {
      console.error('Error verifying document:', error);
      setVerificationStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    
    try {
      const blob = await documentService.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `document-${id}.tt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-12">
        <Loading className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!standardDocument) {
    return (
      <Alert variant="destructive" className="mt-5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No document data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Document Viewer</h2>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Details</span>
              {id && (
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Document Type</h3>
                <p>{standardDocument.metadata.documentType || standardDocument.documentType || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">BL Number</h3>
                <p>{standardDocument.metadata.blNumber || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium">Created</h3>
                <p>{new Date(standardDocument.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Verification Status</h3>
                <div className="flex items-center">
                  {verificationStatus === 'idle' ? (
                    <Button onClick={handleVerifyDocument} variant="outline" size="sm">
                      Verify Now
                    </Button>
                  ) : verificationStatus === 'loading' ? (
                    <span className="flex items-center">
                      <Loading className="mr-2 h-4 w-4" />
                      Verifying...
                    </span>
                  ) : verificationStatus === 'success' ? (
                    <span className="flex items-center text-green-600">
                      <BadgeCheck className="mr-2 h-5 w-5" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Verification Failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        {standardDocument.documentType === 'Transferable' || 
         standardDocument.metadata.documentType === 'bill-of-lading' ? (
          <NFTDocument />
        ) : (
          <InvoiceDocument />
        )}
      </div>
    </div>
  );
};

export default TradeTrustDocumentViewer;