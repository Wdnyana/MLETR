import { Button } from '@/components/ui/button'
import { DownloadDocuments } from '@/types/general-type'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import documentService from '@/service/service'
import Loading from '@/components/ui/loading'

export function DownloadDocument({
  fileName,
  onReset,
  alert,
  setAlert,
  documentId,
}: DownloadDocuments & { documentId?: string | null }) {
  const navigate = useNavigate()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  function backToDashboard() {
    return navigate('/dashboard')
  }

  async function handleDownloadDocument() {
    try {
      setIsDownloading(true)
      setDownloadError(null)
      
      if (documentId) {
        try {
          const blob = await documentService.downloadDocument(documentId);
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          setAlert(true);
          setTimeout(() => {
            setAlert(false);
          }, 3000);
        } catch (error) {
          console.error('Error downloading document:', error);
          setDownloadError('Failed to download document. Please try again.');
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      setDownloadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleDownloadAllDocument() {
    try {
      setIsDownloading(true)
      setDownloadError(null)
      
      try {
        const blob = await documentService.downloadAllDocuments();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'all-documents.zip';
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } catch (error) {
        console.error('Error downloading all documents:', error);
        setDownloadError('Failed to download all documents. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading all documents:', error);
      setDownloadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="w-full">
      <h2>Download Document</h2>

      {alert && (
        <Alert
          className="animate-in fade-in zoom-in mt-5 mb-3 flex items-center gap-3"
          variant="success"
        >
          <BadgeCheck className="h-4 w-4" />
          <div>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription className="text-green-600">
              Your document is successfully downloaded!
            </AlertDescription>
          </div>
        </Alert>
      )}

      <p className="mt-4 text-center text-base font-semibold text-green-600">
        Document(s) Issued Successfully
      </p>
      <p className="mt-4 text-center text-base font-semibold">
        File Name: &ensp;
        <span className="text-base font-medium text-gray-400">{fileName}</span>
      </p>

      <div className="mt-7 grid grid-cols-2 gap-5">
        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={handleDownloadDocument}
        >
          Download Document
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={handleDownloadAllDocument}
          variant="secondary"
        >
          Download All
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={onReset}
          variant="outline"
        >
          Create Another Document
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={backToDashboard}
          variant="destructive"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
