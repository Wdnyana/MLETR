import { LoginEmailOTP } from '@/types/general-type'
import { columns } from './table/columns'
import { DataTable } from './table/data-table'
import { dataDummy } from '@/assets/data/dummy-data'
import UserInfo from './user-info'

export function DashboardComponent({ token, setToken }: LoginEmailOTP) {
  return (
    <>
      {/* <UserInfo token={token} setToken={setToken} /> */}
      <br />
      <DataTable columns={columns} data={dataDummy} />
    </>
  )
}
