import React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DocumentNames } from '@/types/general-type'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function NameDocument({
  fileName,
  setFileName,
  uploadedFile,
  alert,
  setAlert,
}: DocumentNames) {
  function handleDocumentName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setFileName(value)

    setAlert(value.trim() === '')
  }

  return (
    <div className="w-full">
      <h2>Fill Document Details</h2>

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

      <div className="mt-5 grid w-full items-center gap-1.5">
        <Label className="mb-1 ps-3 md:text-base" htmlFor="document">
          Document Name
        </Label>
        <Input
          id="document"
          type="text"
          className="w-full py-5 font-normal md:py-6 md:ps-4 md:text-base"
          placeholder="Enter document name"
          value={fileName}
          onChange={handleDocumentName}
        />

        {uploadedFile && (
          <div className="mt-5 ps-3 pe-1 shadow-sm">
            <p className="text-base font-semibold">
              Uploaded File: &ensp;
              <span className="text-base font-medium text-gray-400">
                {uploadedFile.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
