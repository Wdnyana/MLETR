import DashboardLayout from '@/components/layout/dashboard/dashboard-layout'
import { LoginEmailOTP } from '@/types/general-type'
import DocumentCreator from '@/components/dashboard/DocumentCreator'

export default function CreateDocument({ token, setToken }: LoginEmailOTP) {
  return (
    <DashboardLayout>
      <div className="mt-5 flex h-full w-full flex-col justify-start">
        <h1>Create Document</h1>
        <p className="md:text-base">
          Create a new document by uploading data and filling out the form.
        </p>

        <DocumentCreator token={token} setToken={setToken} />
      </div>
    </DashboardLayout>
  )
}