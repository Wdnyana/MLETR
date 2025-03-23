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
          const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/v1/documents/${documentId}/download`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to download document');
          }

          const blob = await response.blob();
          
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
      
      if (documentId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/v1/documents/download-all`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to download all documents');
          }

          const blob = await response.blob();
          
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
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
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

      {downloadError && (
        <Alert
          className="animate-in fade-in zoom-in mt-5 mb-3 flex items-center gap-3"
          variant="destructive"
        >
          <BadgeCheck className="h-4 w-4" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {downloadError}
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
          disabled={isDownloading}
        >
          {isDownloading ? (
            <div className="flex items-center justify-center gap-2">
              <Loading className="h-4 w-4" />
              <span>Downloading...</span>
            </div>
          ) : (
            'Download Document'
          )}
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={handleDownloadAllDocument}
          variant="secondary"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <div className="flex items-center justify-center gap-2">
              <Loading className="h-4 w-4" />
              <span>Downloading...</span>
            </div>
          ) : (
            'Download All'
          )}
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={onReset}
          variant="outline"
          disabled={isDownloading}
        >
          Create Another Document
        </Button>

        <Button
          className="cursor-pointer rounded-lg p-5 font-normal md:text-base"
          onClick={backToDashboard}
          variant="destructive"
          disabled={isDownloading}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}