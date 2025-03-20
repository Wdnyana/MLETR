import { useDropzone } from 'react-dropzone'
import { AlertCircle, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DragAndDropFiles } from '@/types/general-type'

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
  })

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
      </div>

      {error && (
        <div className="mt-7 flex items-center space-x-2 text-red-500">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {uploading && (
        <div className="mt-7 w-full">
          <div className="mb-2 text-center text-sm font-medium">
            Uploading... {progress}%
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
        <div className="mt-7 flex w-full items-center justify-between rounded-md border py-1 ps-4 pe-1 shadow-sm">
          <span className="truncate text-gray-400">{uploadedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={removeFile}
          >
            <X className="" size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
