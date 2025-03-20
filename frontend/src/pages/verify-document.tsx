import { useState } from 'react'

import { UploadFile } from '@/components/dashboard/upload-file'
import DashboardLayout from '@/components/layout/dashboard/dashboard-layout'
import { SelectForm } from '@/components/ui/select-form'
import { LoginEmailOTP } from '@/types/general-type'
const text = 'Drag & drop or click your TradeTrust file to view its contents'
const formatFiles = '.tt'

export default function VerifyDocument({ token, setToken }: LoginEmailOTP) {
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null)
  const [alertView, setAlertView] = useState(false)

  const handleSelectExchange = (value: string) => {
    setSelectedExchange(value)
    setAlertView(false)
  }

  return (
    <DashboardLayout>
      <div className="mt-5 flex h-full w-full flex-col justify-start">
        <h1>Verify Document</h1>
        <p className="md:text-base">
          Upload or drag and drop your document below to verify it.
        </p>

        <div className="mt-20 mb-5 flex items-center gap-3">
          <p>Verify your document on</p>
          <SelectForm onSelect={handleSelectExchange} error={alertView} />
        </div>
        <div className="lg flex flex-col-reverse justify-center gap-10 lg:flex-row lg:justify-between">
          <UploadFile
            mode="verify"
            desc={text}
            formatFile={formatFiles}
            selectedExchange={selectedExchange}
            alertView={alertView}
            setAlertView={setAlertView}
          />
          <div className="h-full w-auto border">dasd</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
