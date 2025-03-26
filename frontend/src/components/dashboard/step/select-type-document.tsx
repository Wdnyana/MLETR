import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectTypes } from '@/types/general-type'
import { documentTypes } from '@/components/utils/document-helpers'

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

  const documentTypesArray = Object.values(documentTypes);

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

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documentTypesArray.map((data) => (
          <div
            key={data.id}
            className={`cursor-pointer rounded-lg border px-5 py-4 transition-all hover:shadow-md ${
              selected === data.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleSelectTypeDocument(data.id)}
          >
            <div className="flex items-center justify-between">
              <h4
                className={`mb-1 font-medium ${
                  selected === data.id ? 'text-primary' : 'text-foreground'
                }`}
              >
                {data.name}
              </h4>
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  data.category === 'Transferable' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {data.category}
              </span>
            </div>
            <p
              className={`text-sm md:text-base ${
                selected === data.id ? 'text-primary/80' : 'text-muted-foreground'
              }`}
            >
              {data.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}