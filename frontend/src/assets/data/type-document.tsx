import { TypesDocument } from '@/types/general-type'

export const typeDocument: TypesDocument = [
  {
    id: 'bill-of-lading',
    name: 'TradeTrust Bill of Lading v2 (Carrier)',
    description: 'Bill of Lading document for carrier',
  },
  {
    id: 'certificate-of-origin',
    name: 'TradeTrust ChAFTA Certificate of Origin v2',
    description: 'Certificate of Origin document',
  },
  {
    id: 'invoice',
    name: 'TradeTrust Invoice v2 (DNS-DID)',
    description: 'Invoice document with DNS-DID',
  },
]
