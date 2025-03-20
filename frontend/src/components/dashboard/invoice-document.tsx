import { Download, Printer } from 'lucide-react'
import { Button } from '../ui/button'

export function InvoiceDocument() {
  return (
    <>
      <div className="flex w-full">
        <h3 className="block rounded-tl-md rounded-tr-md border-2 border-b-0 px-4 py-2">
          Invoice template
        </h3>
        <div className="flex-grow border-b-2" />
      </div>
      <div className="mt-5">
        <div className="flex w-full justify-end gap-3">
          <Button className="h-11 w-11 cursor-pointer">
            <Download />
          </Button>

          <Button className="h-11 w-11 cursor-pointer">
            <Printer />
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">The document allows fields to be selectively disclosed.</p>
              <p className="text-sm">Remove sensitive information on this document by clicking on the edit button. Downloaded document remains valid.</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">Edit Document</Button>
          </div>
        </div>
        <div className="flex justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Daffa</h2>
            <p className="text-sm text-gray-600">IFASIOFIIOAS</p>
            <p className="text-sm text-gray-600">FASFS, FSAGVSDGSADG</p>
            <p className="text-sm text-gray-600">0908099</p>
          </div>
          <div className="text-3xl font-bold text-blue-600">INVOICE</div>
        </div>
        <div className="flex justify-between px-6">
          <div className="w-1/2 pr-4">
            <div className="mb-2 bg-blue-600 p-2 text-white">BILL TO</div>
            <div className="p-2">
              <p>Daffa</p>
              <p>Raffa</p>
              <p>test124</p>
              <p>Purwakarta, 92882</p>
              <p>08277888</p>
              <p>ardtys998@gmail.com</p>
            </div>
          </div>
          <div className="w-1/2 pl-4 flex">
            <div className='w-full'>
              <div>
                <div className="mb-2 bg-blue-600 p-2 text-center text-white">INVOICE #</div>
                <div className="mb-4 border border-t-0 p-2 text-center">08243012840</div>
              </div>
              <div>
                <div className="mb-2 bg-blue-600 p-2 text-center text-white">CUSTOMER ID</div>
                <div className="mb-4 border border-t-0 p-2 text-center">4234234</div>
              </div>
              
            </div>
            <div className='w-full'>
              <div>
                <div className="mb-2 bg-blue-600 p-2 text-center text-white">DATE</div>
                <div className="mb-4 border border-t-0 p-2 text-center">13 Feb 2025</div>
              </div>
              <div>
                <div className="mb-2 bg-blue-600 p-2 text-center text-white">TERMS</div>
                <div className="mb-4 border border-t-0 p-2 text-center">234234524</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 px-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-blue-700 p-2 text-left">DESCRIPTION</th>
                <th className="border border-blue-700 p-2 text-center">QTY</th>
                <th className="border border-blue-700 p-2 text-center">UNIT PRICE</th>
                <th className="border border-blue-700 p-2 text-right">AMOUNT</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="mt-4 flex justify-end px-6 pb-6">
          <div className="w-1/3">
            <div className="flex justify-between border-b py-2">
              <span>SUBTOTAL</span>
              <span>19000</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span>TAX (90%)</span>
              <span>211112</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>BALANCE DUE</span>
              <span>1000000000</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
