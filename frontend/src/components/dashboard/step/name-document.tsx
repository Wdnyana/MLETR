import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DocumentNames } from '@/types/general-type'
import { AlertCircle, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatFileSize } from '@/lib/utils'

export function NameDocument({
  fileName,
  setFileName,
  uploadedFile,
  alert,
  setAlert,
}: DocumentNames) {
  // Generate a default file name based on the uploaded file when component mounts
  useEffect(() => {
    if (uploadedFile && !fileName) {
      // Get file name without extension
      const baseName = uploadedFile.name.replace(/\.[^/.]+$/, "");
      // Sanitize the name to remove special characters
      const sanitizedName = baseName.replace(/[^a-zA-Z0-9_\- ]/g, "");
      setFileName(sanitizedName);
    }
  }, [uploadedFile, fileName, setFileName]);

  function handleDocumentName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    
    // Validate and sanitize input
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_\- ]/g, "");
    setFileName(sanitizedValue);
    
    // Set alert if the value is empty
    setAlert(sanitizedValue.trim() === '');
  }

  // Function to get file extension
  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  return (
    <div className="w-full">
      <h2>Document Details</h2>

      {alert && (
        <Alert
          className="animate-in fade-in zoom-in mt-5 mb-3 flex items-center gap-3"
          variant="destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-700">
              Document name is required!
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="mt-5 grid w-full items-center gap-6">
        <div>
          <Label className="mb-2 block ps-3 md:text-base" htmlFor="document">
            Document Name
          </Label>
          <Input
            id="document"
            type="text"
            className="w-full py-5 font-normal md:py-6 md:ps-4 md:text-base"
            placeholder="Enter document name"
            value={fileName}
            onChange={handleDocumentName}
            maxLength={50}
          />
          <p className="mt-1 text-xs text-gray-500 ps-3">
            Document name can only contain letters, numbers, spaces, hyphens, and underscores.
            Max 50 characters.
          </p>
        </div>

        {uploadedFile && (
          <div className="mt-2">
            <Label className="mb-2 block ps-3 md:text-base">
              Uploaded File
            </Label>
            <div className="flex w-full items-center gap-3 rounded-md border p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{uploadedFile.name}</span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)} • {getFileExtension(uploadedFile.name).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}