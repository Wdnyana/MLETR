import { HeaderViewDocument } from '@/components/dashboard/header-view-document'
import { InvoiceDocument } from '@/components/dashboard/invoice-document'
import { NFTDocument } from '@/components/dashboard/nft-document'
import DashboardLayout from '@/components/layout/dashboard/dashboard-layout'
import { LoginEmailOTP } from '@/types/general-type'

export default function ViewDocument({ type }: LoginEmailOTP) {
  return (
    <DashboardLayout>
      <div className="mt-5 h-full w-full">
        {type?.type === 'Transferable' ? (
          <>
            <HeaderViewDocument type="Transferable" />

            <div className="mt-20 w-full">
              <NFTDocument />
            </div>
          </>
        ) : (
          <>
            <HeaderViewDocument type="Verifiable" />

            <div className="mt-20 w-full">
              <InvoiceDocument />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
