import { Download, Printer } from 'lucide-react'
import { Button } from '../ui/button'

export function NFTDocument() {
  return (
    <>
      <div className="flex w-full">
        <h3 className="block rounded-tl-md rounded-tr-md border-2 border-b-0 px-4 py-2">
          Bill of Lading Carrier
        </h3>
        <div className="flex-grow border-b-2" />
      </div>
      <div className="mt-5 pb-6">
        <div className="flex w-full justify-end gap-3">
          <Button className="h-11 w-11 cursor-pointer">
            <Download />
          </Button>

          <Button className="h-11 w-11 cursor-pointer">
            <Printer />
          </Button>
        </div>
      </div>

      <div className="border-2 mb-6 pt-6">
          <div className="grid grid-cols-6 border-b-2">
            <div className="col-span-3 p-4 border-r-2 flex justify-center items-center">
              <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center">
                <div className="text-white text-4xl">≈</div>
              </div>
            </div>
            <div className="col-span-2 p-4 border-r-2">
              <p className="font-bold">BILL OF LADING FOR OCEAN TRANSPORT OR MULTIMODAL TRANSPORT</p>
            </div>
            <div className="p-4">
              <p className="text-sm">SCAC 2342323</p>
              <div className="mt-2">
                <p className="text-sm">B/L No</p>
                <p className="font-semibold">9492283</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b-2">
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Shipper</p>
              <p>Daffa Rifki Arditya</p>
              <p>Kampung Sarimulya RT 02 RW 06</p>
              <p>Indonesia</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold mb-2">Booking No</p>
              <p>9492283</p>
              <div className="my-2">
                <p className="text-sm font-semibold mb-2">Export references</p>
              </div>
              <div className="my-2">
                <p className="text-sm font-semibold mb-2">MWK</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b-2">
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Consignee (negotiable & consigned "to order", "to order of" a named Person or "to order of bearer")</p>
              <p>order</p>
              <p>daffa</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold mb-2">Notify Party (see clause 22)</p>
              <p>rAFFA</p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b-2">
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Vessel (see clause 1 + 19)</p>
              <p>242</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Voyage No.</p>
              <p>24111</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold mb-2">Place of Receipt. Applicable only when document used as Multimodal Transport B/L (see clause 1)</p>
              <p>2223</p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b-2">
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Port of Loading</p>
              <p>423432</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Port of Discharge</p>
              <p>3432</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold mb-2">Place of Delivery. Applicable only when document used as Multimodal Transport B/L (see clause 1)</p>
              <p>333</p>
            </div>
          </div>

          <div className="text-center font-bold p-2 border-b-2">
            PARTICULARS FURNISHED BY SHIPPER
          </div>

          <div className="grid grid-cols-6 border-b-2">
            <div className="col-span-4 p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Kind of Packages: Description of goods, Marks and Numbers: Container No./Serial No.</p>
              <p className="text-sm">Above particulars as declared by Shipper, but without responsibility of our representation by Carrier (see clause 14)</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold mb-2">Weight</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold mb-2">Measurement</p>
            </div>
          </div>

          <div className="grid grid-cols-6 border-b-2">
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold">Freight & Charges</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold">Rate</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold">Unit</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold">Currency</p>
            </div>
            <div className="p-4 border-r-2">
              <p className="text-sm font-semibold">Prepaid</p>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold">Collect</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-0">
            <div className="p-4 border border-r-2 border-b-2">
              <p className="text-sm font-semibold mb-2">Carrier's Receipt (see clause 1 and 14). Total number of containers or packages received by Carrier:</p>
              <p>TEST124</p>
            </div>
            
            <div className="p-4 border border-r-2 border-b-2">
              <p className="text-sm font-semibold mb-2">Place of Issue of B/L</p>
              <p>GRMNY</p>
            </div>
            
            <div className="row-span-3 border border-b-2 flex flex-col">
              <div className="p-4 border-b flex-grow flex items-end justify-center">
                <div className="text-right">
                  <p>34234</p>
                  <div className="mx-auto">
                    <img src="/path-to-image" alt="Certificate" className="w-24 h-24 mb-2" />
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-center">
                <p>TY</p>
              </div>
            </div>
            
            <div className="p-4 border border-r-2 border-b-2">
              <p className="text-sm font-semibold mb-2">Number & Sequence of Original B(s)/L</p>
              <p>23982839</p>
            </div>
            
            <div className="p-4 border border-r-2 border-b-2">
              <p className="text-sm font-semibold mb-2">Date of Issue of B/L</p>
              <p>2025-02-15</p>
            </div>
            
            <div className="p-4 border border-r-2">
              <p className="text-sm font-semibold mb-2">Declared Value (see clause 7.3)</p>
            </div>
            
            <div className="p-4 border border-r-2">
              <p className="text-sm font-semibold mb-2">Shipped on Board Date (Local Time)</p>
              <p>2025-02-22</p>
            </div>
          </div>
        </div>
    </>
  )
}
