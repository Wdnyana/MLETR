import { BadgeCheck } from 'lucide-react'
import { HeaderDocumentReview } from '@/types/general-type'
import { Button } from '../ui/button'

function HeaderDocumentViews() {
  return (
    <div className="w-auto">
      <h2 className="font-medium">
        Issued by
        <span className="text-primary capitalize">
          &ensp;SANDBOX.TRADETRUST.IO
        </span>
      </h2>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-green-700" />
          <p>Document has been issued.</p>
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="text-green-700" />
          <p>Document issuer has been identified.</p>
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="text-green-700" />
          <p>Document has not been tampered with.</p>
        </div>
      </div>
    </div>
  )
}

export function HeaderViewDocument({ type }: HeaderDocumentReview) {
  return (
    <>
      {type === 'Transferable' ? (
        <>
          <div className="flex w-full flex-col items-center justify-between md:flex-row">
            <HeaderDocumentViews />

            <div className="flex flex-col">
              <h3 className="text-primary mb-4">NFT information:</h3>

              <a
                href="https://ui.shadcn.com/docs/components/input-otp"
                className="mb-3 font-medium hover:text-blue-400 md:text-base"
              >
                View NFT Registry
              </a>

              <a
                href="https://ui.shadcn.com/docs/components/input-otp"
                className="mb-3 font-medium hover:text-blue-400 md:text-base"
              >
                View Endorsement Chain
              </a>
            </div>
          </div>
          <div className="mt-16">
            <div className="flex gap-3">
              <p className="bg-accent inline-block rounded-md px-4 py-2 text-orange-400 md:text-base">
                Transferable
              </p>
              <p className="bg-accent inline-block rounded-md px-4 py-2 text-orange-400 md:text-base">
                Transferable
              </p>
            </div>

            <div className="mt-10 flex lg:gap-36">
              <div className="flex flex-col">
                <h4 className="text-gray-600">Owner:</h4>
                <a
                  href="https://stability.blockscout.com/address/0x7d7C1C8B4eB6edD23BCA43F4d032EBb21c9258F9"
                  className="py-1 text-blue-700 md:text-base"
                >
                  0x0464Ed822C6BcCAbd1CE8a7812451881F934355C
                </a>
              </div>

              <div className="flex flex-col">
                <h4 className="text-gray-600">Holder:</h4>
                <a
                  href="https://stability.blockscout.com/address/0x7d7C1C8B4eB6edD23BCA43F4d032EBb21c9258F9"
                  className="py-1 text-blue-700 md:text-base"
                >
                  0x9c1d83d39574ab4d3817f5A942d4b0d149fdd6BD
                </a>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button className="cursor-pointer md:py-5">Connect Wallet</Button>
            </div>
          </div>
        </>
      ) : (
        <HeaderDocumentViews />
      )}
    </>
  )
}
