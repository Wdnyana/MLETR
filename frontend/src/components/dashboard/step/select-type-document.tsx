import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectTypes } from '@/types/general-type'

export function SelectTypeDocument({
  setSelectTypeDoc,
  selected,
  alert,
  setAlert,
}: SelectTypes) {
  function handleSelectTypeDocument(id: string) {
    setSelectTypeDoc(selected === id ? '' : id)
    setAlert(false)
  }

  return (
    <div className="w-full">
      <h2 className="mb-5 text-start">Choose Document Type</h2>

      {alert && (
        <Alert
          className="animate-in fade-in zoom-in mt-4 flex items-center gap-3"
          variant="destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-700">
              Select Document type is required!
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="mt-5 flex flex-col gap-5">
        <div
          className={`cursor-pointer rounded-lg border px-7 py-5 ${selected === 'transferable' ? 'border-primary' : 'border-gray-300'}`}
          onClick={() => handleSelectTypeDocument('transferable')}
        >
          <h4
            className={`mb-1 font-normal ${selected === 'transferable' ? 'text-primary' : 'text-gray-700'}`}
          >
            Transferable Document
          </h4>
          <p
            className={`md:text-base ${selected === 'transferable' ? 'text-primary' : 'text-gray-500'}`}
          >
            Document that can be transferred between users and traded on a marketplace.
          </p>
        </div>

        <div
          className={`cursor-pointer rounded-lg border px-7 py-5 ${selected === 'verifiable' ? 'border-primary' : 'border-gray-300'}`}
          onClick={() => handleSelectTypeDocument('verifiable')}
        >
          <h4
            className={`mb-1 font-normal ${selected === 'verifiable' ? 'text-primary' : 'text-gray-700'}`}
          >
            Verifiable Document
          </h4>
          <p
            className={`md:text-base ${selected === 'verifiable' ? 'text-primary' : 'text-gray-500'}`}
          >
            Document that can be verified but not transferred; maintains permanent ownership.
          </p>
        </div>
      </div>
    </div>
  )
}