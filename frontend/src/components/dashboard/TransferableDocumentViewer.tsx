// frontend/src/components/dashboard/TransferableDocumentViewer.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeCheck, AlertCircle, Download, ChevronLeft } from 'lucide-react';
import documentService from '@/service/service';
import Loading from '@/components/ui/loading';
import { NFTDocument } from './nft-document';
import TransferableDocumentDetails from './TransferableDocumentDetails';

const TransferableDocumentViewer: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const [ownershipData, setOwnershipData] = useState<any>(null);
  
  const id = params.id;

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError('No document ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get document details
        const docResponse = await documentService.getDocumentDetails(id);
        setDocumentData(docResponse.document);
        
        // Get ownership information
        if (docResponse.document.documentType === 'Transferable') {
          const ownershipResponse = await documentService.getDocumentOwnership(id);
          setOwnershipData(ownershipResponse.ownership);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to fetch document');
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);

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
      setError('Failed to download document');
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

  if (!documentData) {
    return (
      <Alert variant="destructive" className="mt-5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No document data available</AlertDescription>
      </Alert>
    );
  }

  const isTransferable = documentData.documentType === 'Transferable';

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{isTransferable ? 'Transferable Document' : 'Document'} Viewer</h2>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Details</span>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Document Type</h3>
                <p>{documentData.documentType}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="flex items-center">
                  {documentData.status}
                  {documentData.status === 'Verified' && (
                    <BadgeCheck className="ml-1 h-4 w-4 text-green-500" />
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Created</h3>
                <p>{new Date(documentData.createdAt).toLocaleString()}</p>
              </div>
              
              {documentData.blockchainId && (
                <div className="col-span-3">
                  <h3 className="font-medium">Blockchain ID</h3>
                  <p className="text-xs break-all">{documentData.blockchainId}</p>
                </div>
              )}
              
              {documentData.transactionHash && (
                <div className="col-span-3">
                  <h3 className="font-medium">Transaction Hash</h3>
                  <p className="text-xs break-all">{documentData.transactionHash}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isTransferable && ownershipData && (
        <div className="mb-6">
          <TransferableDocumentDetails
            documentId={id as string}
            documentHash={documentData.documentHash}
            currentBeneficiary={ownershipData.beneficiary}
            currentHolder={ownershipData.holder}
          />
        </div>
      )}
      
      <div className="mt-6">
        <NFTDocument />
      </div>
    </div>
  );
};

export default TransferableDocumentViewer;