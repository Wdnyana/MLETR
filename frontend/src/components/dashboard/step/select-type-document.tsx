import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { typeDocument } from '@/assets/data/type-document'
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
        {typeDocument.map((data) => (
          <div
            key={data.id}
            className={`cursor-pointer rounded-lg border px-7 py-5 ${selected === data.id ? 'border-primary' : 'border-gray-300'}`}
            onClick={() => handleSelectTypeDocument(data.id)}
          >
            <h4
              className={`mb-1 font-normal ${selected === data.id ? 'text-primary' : 'text-gray-200'}`}
            >
              {data.name}
            </h4>
            <p
              className={`md:text-base ${selected === data.id ? 'text-primary' : 'text-gray-400'}`}
            >
              {data.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
