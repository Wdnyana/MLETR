import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { UploadFiles } from '@/types/general-type'
import { SelectTypeDocument } from './step/select-type-document'
import { NameDocument } from './step/name-document'
import { DownloadDocument } from './step/download-document'
import { DragAndDrop } from './step/drag-drop'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useUploadHandler } from '@/hooks/use-upload-handler'
import { cn } from '../../lib/utils'
import { DocumentView } from './document-view'
import { useNavigate } from 'react-router-dom'
import documentService from '@/service/service'

export function UploadFile({
  desc,
  formatFile,
  mode,
  selectedExchange,
  alertView,
  setAlertView,
}: UploadFiles) {
  const {
    uploadedFile,
    createFile,
    error,
    progress,
    uploading,
    fileAccept,
    onDragAndDrop,
    rejectedFile,
    removeFileUpload,
  } = useUploadHandler(mode)

  const [step, setStep] = useState<number>(1)
  const [selected, setSelectTypeDoc] = useState<string>('')
  const [alert, setAlert] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [verifyMode, setVerifyMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<string | null>(null)

  const navigate = useNavigate()

  function handleToDashboard() {
    setFileName('')
    setStep(1)
  }

  async function nextStep() {
    if (mode === 'Verifiable' && step === 1 && !selectedExchange) {
      setAlertView?.(true)
      return
    }
    if ((step === 2 && !selected) || (step === 3 && fileName.trim() === '')) {
      setAlert(true)
      return
    }

    setAlert(false)
    setAlertView?.(false)

    if (mode === 'Create' && step === 3) {
      try {
        setIsSubmitting(true)

        // Create the document with the file data
        const res = await documentService.createDocument({
          type: selected as 'Transferable' | 'Verifiable',
          metadata: createFile?.metadata || {},
          fileName: fileName,
        })

        // Save the job ID for status checking
        setJobId(res.job.id)
        setJobStatus('pending')

        // Move to the next step to show download
        setStep((prev) => prev + 1)
      } catch (error) {
        console.error('Document creation error:', error)
        toast({
          title: 'Error creating document',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Otherwise just move to the next step
      setStep((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (mode === 'Verifiable' && uploadedFile && progress === 100) {
      setVerifyMode(true)
    }
  }, [uploadedFile, progress, mode])

  useEffect(() => {
    if (verifyMode) {
      navigate('/document-viewer')
    }
  }, [verifyMode, navigate])

  return (
    <div
      className={cn(
        `mx-auto flex flex-col items-center justify-center space-y-5 md:w-3/4 lg:mx-0 lg:w-1/2 xl:w-[35%]`,
      )}
    >
      {step === 1 && (
        <>
          {alertView && mode === 'Verifiable' && !selectedExchange && (
            <Alert
              className="mb-3 flex items-center gap-3"
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  Select Exchange before next step!
                </AlertDescription>
              </div>
            </Alert>
          )}
          <DragAndDrop
            desc={desc}
            formatFile={formatFile}
            error={error}
            uploading={uploading}
            progress={progress}
            uploadedFile={uploadedFile}
            onDragAndDrop={onDragAndDrop}
            rejectedFiles={rejectedFile}
            removeFile={removeFileUpload}
            fileAccept={fileAccept}
          />
        </>
      )}

      {step === 2 && mode === 'Create' && (
        <SelectTypeDocument
          setSelectTypeDoc={setSelectTypeDoc}
          selected={selected}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      {step === 2 && mode === 'Verifiable' && <DocumentView />}

      {step === 3 && mode === 'Create' && (
        <NameDocument
          fileName={fileName}
          uploadedFile={uploadedFile}
          setFileName={setFileName}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      {step === 4 && mode === 'Create' && (
        <DownloadDocument
          fileName={`${fileName}.tt`}
          onReset={handleToDashboard}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      <div className="mt-4 flex w-full justify-end gap-8">
        <Button
          variant="outline"
          className="cursor-pointer rounded-lg px-10 py-5 font-normal md:text-base"
          onClick={() => setStep((prev) => prev - 1)}
          disabled={step === 1}
        >
          Back
        </Button>

        <Button
          className="cursor-pointer rounded-lg px-10 py-5 font-normal md:text-base"
          onClick={nextStep}
          disabled={
            (step === 1 && (!uploadedFile || uploading || progress < 100)) ||
            step === 4
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
