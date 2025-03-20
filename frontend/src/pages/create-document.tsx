import { UploadFile } from '@/components/dashboard/upload-file'
import DashboardLayout from '@/components/layout/dashboard/dashboard-layout'
import { LoginEmailOTP } from '@/types/general-type'

const text = 'Drag & drop or click to upload your file configuration here'
const formatFiles = '.csv, .json'

export default function CreateDocument({ token, setToken }: LoginEmailOTP) {
  return (
    <DashboardLayout>
      <div className="mt-5 flex h-full w-full flex-col justify-start">
        <h1>Create and Revoke Document</h1>
        <p className="md:text-base">
          Upload or drag and drop your document below to create or revoke a
          document.
        </p>

        <div className="mt-24 flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          <UploadFile mode="create" desc={text} formatFile={formatFiles} />
          <div className="h-full w-auto border">dasd</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
