/**
 * Helper functions for document handling
 */

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  category: 'Transferable' | 'Verifiable';
}

export const documentTypes: Record<string, DocumentType> = {
  'bill-of-lading': {
    id: 'bill-of-lading',
    name: 'TradeTrust Bill of Lading v2 (Carrier)',
    description: 'Bill of Lading document for carrier',
    category: 'Transferable'
  },
  'chafta-certificate': {
    id: 'chafta-certificate',
    name: 'TradeTrust ChAFTA Certificate of Origin v2',
    description: 'Certificate of Origin document for trade',
    category: 'Verifiable'
  },
  'invoice': {
    id: 'invoice',
    name: 'TradeTrust Invoice v2 (DNS-DID)',
    description: 'Invoice document for trade',
    category: 'Verifiable'
  },
  'air-waybill': {
    id: 'air-waybill',
    name: 'TradeTrust Air Waybill v2',
    description: 'Air Waybill document for air cargo',
    category: 'Transferable'
  },
  'sea-waybill': {
    id: 'sea-waybill',
    name: 'TradeTrust Sea Waybill v2',
    description: 'Sea Waybill document for maritime transport',
    category: 'Transferable'
  },
  'ships-delivery-order': {
    id: 'ships-delivery-order',
    name: 'TradeTrust Ship\'s Delivery Order v2',
    description: 'Ship\'s Delivery Order document',
    category: 'Verifiable'
  },
};

/**
 * Get document type object by ID
 * @param id Document type ID
 * @returns DocumentType object or undefined if not found
 */
export function getDocumentTypeById(id: string): DocumentType | undefined {
  return documentTypes[id];
}

/**
 * Parse document type ID from various formats
 * @param input Document type string in various formats
 * @returns Normalized document type ID
 */
export function parseDocumentType(input: string): string {
  const normalized = input
    .replace(/^TradeTrust/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  
  if (normalized.includes('bill-of-lading') || normalized.includes('bl')) {
    return 'bill-of-lading';
  }
  
  if (normalized.includes('chafta') || normalized.includes('certificate-of-origin')) {
    return 'chafta-certificate';
  }
  
  if (normalized.includes('invoice')) {
    return 'invoice';
  }
  
  return normalized;
}

/**
 * Format file metadata for form pre-filling based on document type
 * @param metadata Raw file metadata
 * @param documentType Document type ID
 * @returns Formatted metadata for form pre-filling
 */
export function formatMetadataForForm(metadata: any, documentType: string): any {
  switch (documentType) {
    case 'bill-of-lading':
      return formatBillOfLadingMetadata(metadata);
    case 'chafta-certificate':
      return formatChaftaMetadata(metadata);
    case 'invoice':
      return formatInvoiceMetadata(metadata);
    default:
      return metadata;
  }
}

/**
 * Format Bill of Lading metadata
 */
function formatBillOfLadingMetadata(metadata: any): any {
  return {
    blNumber: metadata.blNumber || metadata.BLNumber || metadata.bl_number || '',
    scac: metadata.scac || metadata.SCAC || '',
    shipperName: metadata.shipper?.name || metadata.shipperName || '',
    shipperStreet: metadata.shipper?.street || metadata.shipperStreet || '',
    shipperCountry: metadata.shipper?.country || metadata.shipperCountry || '',
    consigneeTo: metadata.consignee?.to || metadata.consigneeTo || '',
    consigneeName: metadata.consignee?.name || metadata.consigneeName || '',
    vessel: metadata.vessel || '',
    voyageNo: metadata.voyageNo || metadata.voyage_no || '',
    portOfLoading: metadata.portOfLoading || metadata.port_of_loading || '',
    portOfDischarge: metadata.portOfDischarge || metadata.port_of_discharge || '',
    packages: (metadata.packages || []).map((pkg: any) => ({
      description: pkg.description || '',
      weight: pkg.weight || '',
      measurement: pkg.measurement || ''
    }))
  };
}

/**
 * Format ChAFTA Certificate metadata
 */
function formatChaftaMetadata(metadata: any): any {
  return {
    certificateNumber: metadata.certificateNumber || metadata.certificate_number || '',
    exporterName: metadata.exporter?.name || metadata.exporterName || '',
    producerName: metadata.producer?.name || metadata.producerName || '',
    importerName: metadata.importer?.name || metadata.importerName || '',
  };
}

/**
 * Format Invoice metadata
 */
function formatInvoiceMetadata(metadata: any): any {
  return {
    invoiceNumber: metadata.invoiceNumber || metadata.invoice_number || '',
    sellerName: metadata.seller?.name || metadata.sellerName || '',
    buyerName: metadata.buyer?.name || metadata.buyerName || '',
  };
}

/**
 * Validate document data based on document type
 * @param data Document data
 * @param documentType Document type ID
 * @returns Validation result {valid: boolean, errors: string[]}
 */
export function validateDocumentData(data: any, documentType: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  switch (documentType) {
    case 'bill-of-lading':
      if (!data.blNumber) errors.push('BL Number is required');
      if (!data.scac) errors.push('SCAC is required');
      if (!data.shipperName) errors.push('Shipper name is required');
      break;
      
    case 'chafta-certificate':
      if (!data.certificateNumber) errors.push('Certificate Number is required');
      if (!data.exporterName) errors.push('Exporter name is required');
      break;
      
    case 'invoice':
      if (!data.invoiceNumber) errors.push('Invoice Number is required');
      if (!data.sellerName) errors.push('Seller name is required');
      break;
      
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}