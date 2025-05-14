// Create a new component: frontend/src/components/dashboard/TransferableDocumentDetails.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import documentService from '@/service/service';
import Loading from '@/components/ui/loading';

interface TransferableDocumentDetailsProps {
  documentId: string;
  documentHash: string;
  currentBeneficiary?: string;
  currentHolder?: string;
}

const TransferableDocumentDetails: React.FC<TransferableDocumentDetailsProps> = ({
  documentId,
  documentHash,
  currentBeneficiary,
  currentHolder
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newBeneficiary, setNewBeneficiary] = useState('');
  const [newHolder, setNewHolder] = useState('');
  const [ownershipInfo, setOwnershipInfo] = useState<{
    beneficiary: string;
    holder: string;
  } | null>(null);

  useEffect(() => {
    const loadOwnershipInfo = async () => {
      try {
        setLoading(true);
        const result = await documentService.getDocumentOwnership(documentId);
        setOwnershipInfo({
          beneficiary: result.beneficiary,
          holder: result.holder
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading ownership info:', error);
        setError('Failed to load document ownership information');
        setLoading(false);
      }
    };

    loadOwnershipInfo();
  }, [documentId]);

  const handleTransfer = async () => {
    try {
      if (!newBeneficiary || !newHolder) {
        setError('Both beneficiary and holder addresses are required');
        return;
      }
      
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await documentService.transferDocument(documentId, {
        newBeneficiary,
        newHolder
      });
      console.log('Transfer result:', result);
      
      setSuccess('Document transferred successfully');
      setOwnershipInfo({
        beneficiary: newBeneficiary,
        holder: newHolder
      });
      
      // Clear inputs
      setNewBeneficiary('');
      setNewHolder('');
      
      setLoading(false);
    } catch (error) {
      console.error('Error transferring document:', error);
      setError('Failed to transfer document: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transferable Document Ownership</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center my-4">
            <Loading className="h-8 w-8" />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Current Ownership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Beneficiary</Label>
              <p className="text-sm break-all mt-1">
                {ownershipInfo?.beneficiary || currentBeneficiary || 'Loading...'}
              </p>
            </div>
            <div>
              <Label className="font-medium">Holder</Label>
              <p className="text-sm break-all mt-1">
                {ownershipInfo?.holder || currentHolder || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Transfer Document</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newBeneficiary">New Beneficiary Address</Label>
              <Input
                id="newBeneficiary"
                placeholder="0x..."
                value={newBeneficiary}
                onChange={(e) => setNewBeneficiary(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="newHolder">New Holder Address</Label>
              <Input
                id="newHolder"
                placeholder="0x..."
                value={newHolder}
                onChange={(e) => setNewHolder(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleTransfer} 
              disabled={loading || !newBeneficiary || !newHolder}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loading className="mr-2 h-4 w-4" />
                  Transferring...
                </>
              ) : 'Transfer Document'}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Document Hash: {documentHash}</p>
          <p>Document ID: {documentId}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferableDocumentDetails;