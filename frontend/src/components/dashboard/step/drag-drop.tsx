import { useDropzone } from 'react-dropzone'
import { AlertCircle, UploadCloud, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DragAndDropFiles } from '@/types/general-type'
import { formatFileSize } from '@/lib/utils'

export function DragAndDrop({
  desc,
  formatFile,
  error,
  onDragAndDrop,
  rejectedFiles,
  uploading,
  uploadedFile,
  progress,
  removeFile,
  fileAccept,
}: DragAndDropFiles) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: fileAccept,
    onDrop: onDragAndDrop,
    onDropRejected: rejectedFiles,
    multiple: false,
    maxSize: 10485760, 
  })

  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`w-full border-2 px-10 py-20 xl:py-28 ${
          error
            ? 'border-dashed border-red-500'
            : isDragActive
              ? 'border-primary border-dashed'
              : 'border-dashed border-gray-300'
        } cursor-pointer rounded-lg text-center shadow-lg transition-all`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-2" size={40} />
        <p className="mt-5 mb-2 md:text-base">
          {isDragActive ? 'Drop the file here...' : desc}
        </p>
        <p className="md:text-base">
          Supported formats:&ensp;
          <span className="text-primary text-[18px] font-semibold">
            {formatFile}
          </span>
        </p>
        {!uploadedFile && !uploading && (
          <p className="text-gray-500 mt-3 text-sm">Maximum file size: 10MB</p>
        )}
      </div>

      {error && (
        <div className="mt-7 flex items-center space-x-2 text-red-500">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {uploading && (
        <div className="mt-7 w-full">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>Uploading {uploadedFile?.name}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded bg-gray-200">
            <div
              className="h-full rounded bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadedFile && !uploading && (
        <div className="mt-7 w-full">
          <div className="flex w-full items-center justify-between rounded-md border py-3 px-4 shadow-sm">
            <div className="flex items-center gap-3">
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
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer text-gray-500 hover:text-red-500"
              onClick={removeFile}
            >
              <X className="" size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}