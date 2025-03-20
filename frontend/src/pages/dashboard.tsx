import { DashboardComponent } from '@/components/dashboard/dashbord-component'
import DashboardLayout from '@/components/layout/dashboard/dashboard-layout'
import { LoginEmailOTP } from '@/types/general-type'

export default function Dashboard({ token, setToken }: LoginEmailOTP) {
  return (
    <DashboardLayout>
      <DashboardComponent token={token} setToken={setToken} />
    </DashboardLayout>
  )
}
