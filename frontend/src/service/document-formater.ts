import{v4 as uuidv4} from 'uuid';
import { verify, isValid } from "@tradetrust-tt/tt-verify";
import { wrapDocument, utils } from "@govtechsg/open-attestation";

export function detectDocumentFormat(document: any): string {
  if (document.version && document.version === "https://schema.openattestation.com/2.0/schema.json") {
    return "OpenAttestation";
  }
  
  if (document.version && document.version === "https://schema.openattestation.com/3.0/schema.json") {
    return "OpenAttestation3";
  }
  
  if (document.signature && (document.signature.type === "SHA3MerkleProof" || document.signature.targetHash)) {
    return "OpenAttestation"; // Likely OA format without version
  }
  
  if (document.documentType === 'bill-of-lading' || document.documentType === 'Transferable') {
    return "Legacy";
  }
  
  return "Unknown";
}
export function formatToOpenAttestation(document: any): any {
    const format = detectDocumentFormat(document)
    if (format === "OpenAttestation" || format === "OpenAttestation3") {
      return document; 
    }
    // if (document.version && document.version === "https://schema.openattestation.com/2.0/schema.json") {
    //   return document;
    // }
  
    const metadata = document.metadata || document;
    const documentHash = document.documentHash || '';
    
    const formattedHash = documentHash.startsWith('0x') 
      ? documentHash.substring(2) 
      : documentHash;
    
    const saltData = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => saltData(item));
      }
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          result[key] = saltData(value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          result[key] = `${uuidv4()}:${typeof value}:${value}`;
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };
  
    const formattedData: any = {
      version: "https://schema.openattestation.com/2.0/schema.json",
      data: {
        $template: {
          type: `${uuidv4()}:string:EMBEDDED_RENDERER`,
          name: `${uuidv4()}:string:${(metadata.documentType || 'bill-of-lading').toUpperCase()}`,
          url: `${uuidv4()}:string:https://generic-templates.tradetrust.io`
        },
        issuers: [
          {
            name: `${uuidv4()}:string:DOCUMENT ISSUER`,
            tokenRegistry: `${uuidv4()}:string:${metadata.owner || '0x0000000000000000000000000000000000000000'}`,
            identityProof: {
              type: `${uuidv4()}:string:DNS-TXT`,
              location: `${uuidv4()}:string:xdctraderpc.xinfin.network`
            },
            revocation: {
              type: `${uuidv4()}:string:NONE`
            }
          }
        ],
        network: {
          chain: `${uuidv4()}:string:${metadata.networkChain || 'XDC'}`,
          chainId: `${uuidv4()}:string:${metadata.networkChainId || '51'}`
        }
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash: formattedHash,
        proof: [],
        merkleRoot: formattedHash
      }
    };
  
    if (metadata.documentType === 'bill-of-lading' || !metadata.documentType) {
      formattedData.data = {
        ...formattedData.data,
        shipper: {
          name: `${uuidv4()}:string:${metadata.shipperName || ''}`,
          address: {
            street: `${uuidv4()}:string:${metadata.shipperStreet || ''}`,
            country: `${uuidv4()}:string:${metadata.shipperCountry || ''}`
          }
        },
        consignee: {
          toOrderOfText: `${uuidv4()}:string:${metadata.consigneeTo || ''}`,
          name: `${uuidv4()}:string:${metadata.consigneeName || ''}`
        },
        notifyParty: {
          name: `${uuidv4()}:string:${metadata.notifyPartyName || ''}`
        },
        blNumber: `${uuidv4()}:string:${metadata.blNumber || ''}`,
        scac: `${uuidv4()}:string:${metadata.scac || ''}`,
        carrierName: `${uuidv4()}:string:${metadata.carrierSignatory || ''}`,
        onwardInlandRouting: `${uuidv4()}:string:${metadata.onwardInlandRouting || ''}`,
        vessel: `${uuidv4()}:string:${metadata.vessel || ''}`,
        voyageNo: `${uuidv4()}:string:${metadata.voyageNo || ''}`,
        portOfLoading: `${uuidv4()}:string:${metadata.portOfLoading || ''}`,
        portOfDischarge: `${uuidv4()}:string:${metadata.portOfDischarge || ''}`,
        placeOfReceipt: `${uuidv4()}:string:${metadata.placeOfReceipt || ''}`,
        placeOfDelivery: `${uuidv4()}:string:${metadata.placeOfDelivery || ''}`,
        carrierReceipt: `${uuidv4()}:string:${metadata.carriersReceipt || ''}`,
        placeOfIssueBL: `${uuidv4()}:string:${metadata.placeOfIssue || ''}`,
        numberOfOriginalBL: `${uuidv4()}:string:${metadata.numberOfOriginalBL || ''}`,
        dateOfIssueBL: `${uuidv4()}:string:${metadata.dateOfIssue || ''}`,
        shippedOnBoardDate: `${uuidv4()}:string:${metadata.shippedOnBoardDate || ''}`,
        signForTermsAndCondition: `${uuidv4()}:string:${metadata.termsAndConditions || ''}`,
        signedForCarrierText: `${uuidv4()}:string:${metadata.carrierSignatureText || ''}`,
        termsOfCarriage: `${uuidv4()}:string:${metadata.termsOfCarriage || ''}`
      };
      
      if (metadata.packages && Array.isArray(metadata.packages)) {
        formattedData.data.packages = saltData(metadata.packages);
      }
    }
  
    const validation = validateDocumentHash(formattedData);
    if (!validation.valid) {
      console.warn('Document validation issues:', validation.issues);
    }
  
    return formattedData;
}

export function parseFromOpenAttestation(document: any): any {
    if (!document.version || document.version !== "https://schema.openattestation.com/2.0/schema.json") {
      return document;
    }

    function parseSaltedValue(value: string): any{
      if(typeof value !== 'string' || !value.includes(':')) return value;

      console.log("Vals: ", value)  

      const parts = value.split(':');
      console.log("parts: ", parts)
      if(parts.length < 3) return value;

      const valueType = parts[1];
      console.log("valType: ", valueType)
      const actualValue = parts.slice(2).join(':');
      console.log("actVal: ", actualValue)

      switch(valueType) { 
        case 'number':
          return Number(actualValue);
        case 'boolean':
          return actualValue.toLowerCase() === 'true';
        default:
          return actualValue;
      }
    }

    const desaltData = (obj: any): any => {

        if(typeof obj !== 'object' || obj === null) return obj;

        if(Array.isArray(obj)){
            return obj.map(item => desaltData(item))
        }

        const result: any = {}

        
        for (const[key,value] of Object.entries(obj)){
          if(typeof value === 'object' && obj !== null){
            result[key] = desaltData(value)
          }else{
            result[key] = parseSaltedValue(value as string)
          }
        }

        return result
    }
  const data = desaltData(document.data);
  
  const documentType = data.$template?.name?.toLowerCase().replace(/_/g, '-') || 'bill-of-lading';
  
  const standardDocument: any = {
    documentType: documentType,
    documentHash: document.signature?.targetHash || '',
    metadata: {
      documentType: documentType,
      blNumber: data.blNumber || '',
      scac: data.scac || '',
      carrierSignatory: data.carrierName || '',
      shipperName: data.shipper?.name || '',
      shipperStreet: data.shipper?.address?.street || '',
      shipperCountry: data.shipper?.address?.country || '',
      onwardInlandRouting: data.onwardInlandRouting || '',
      consigneeTo: data.consignee?.toOrderOfText || '',
      consigneeName: data.consignee?.name || '',
      notifyPartyName: data.notifyParty?.name || '',
      vessel: data.vessel || '',
      voyageNo: data.voyageNo || '',
      portOfLoading: data.portOfLoading || '',
      portOfDischarge: data.portOfDischarge || '',
      placeOfReceipt: data.placeOfReceipt || '',
      placeOfDelivery: data.placeOfDelivery || '',
      carriersReceipt: data.carrierReceipt || '',
      placeOfIssue: data.placeOfIssueBL || '',
      numberOfOriginalBL: data.numberOfOriginalBL || '',
      dateOfIssue: data.dateOfIssueBL || '',
      shippedOnBoardDate: data.shippedOnBoardDate || '',
      termsAndConditions: data.signForTermsAndCondition || '',
      termsOfCarriage: data.termsOfCarriage || '',
      owner: data.issuers?.[0]?.tokenRegistry || '',
      holder: data.holder || ''
    }
  };
  
  if (data.packages) {
    standardDocument.metadata.packages = data.packages;
  }
  
  return standardDocument;
}


export function validateDocumentHash(document: any): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    const isOpenAttestation = document.version === 'https://schema.openattestation.com/2.0/schema.json';

    const documentHash = isOpenAttestation
        ? document.signature?.targetHash
        : document.documentHash;

    
    if (!documentHash) {
      issues.push('Missing document hash');
    } else if (!/^[0-9a-f]{64}$/i.test(documentHash.replace(/^0x/, ''))) {
      issues.push('Invalid document hash format - should be a 64-character hex string');
    }
    
    if (!isOpenAttestation) {
      issues.push('Not using OpenAttestation 2.0 schema');
    }
    
    if (isOpenAttestation && (!document.signature || !document.signature.targetHash)) {
      issues.push('Missing signature or targetHash');
    } 
    if (!isOpenAttestation && document.signature?.targetHash && documentHash !== document.signature.targetHash && 
        '0x' + document.signature.targetHash !== documentHash && 
        document.signature.targetHash !== '0x' + documentHash) {
      issues.push('Document hash does not match signature targetHash');
    }
    
    if (!document.data) {
      issues.push('Missing document data');
    } else {
      if (!document.data.$template) {
        issues.push('Missing $template in document data');
      }
      if (!document.data.issuers || !Array.isArray(document.data.issuers) || document.data.issuers.length === 0) {
        issues.push('Missing or invalid issuers array');
      } else {
        const issuer = document.data.issuers[0];
        if (!issuer.identityProof || !issuer.identityProof.type) {
          issues.push('Missing or invalid identity proof in issuer');
        }
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

export async function verifyTradeTrustDocument(document: any) {
  console.log('Verifying TradeTrust document...');
  console.log('Document being verified:', document);
  try {

    let wrappedDocument = document;

    console.log('Document version:', document.version);
    console.log('Document identity proof location:', document.data?.issuers?.[0]?.identityProof?.location);
    if (!document.version || document.version !== "https://schema.openattestation.com/2.0/schema.json") {
      throw new Error("Document is not in OpenAttestation format");
    }
    
    const verificationResults = await verify(wrappedDocument);
    console.log('Verification results:', verificationResults);
    
    const isDocumentValid = verificationResults.every(r => r.status === "VALID");
    console.log('Is document valid:', isDocumentValid);
    
    const documentIntegrity = verificationResults.find(r => r.type === "DOCUMENT_INTEGRITY");
    const documentStatus = verificationResults.find(r => r.type === "DOCUMENT_STATUS");
    const issuerIdentity = verificationResults.find(r => r.type === "ISSUER_IDENTITY");

    console.log('Document integrity:', documentIntegrity);
    console.log('Document status:', documentStatus);
    console.log('Issuer identity:', issuerIdentity);
    
    return {
      verified: isDocumentValid,
      verification: {
        documentIntegrity: documentIntegrity?.status === "VALID",
        documentStatus: documentStatus?.status === "VALID",
        issuerIdentity: issuerIdentity?.status === "VALID",
        details: verificationResults
      }
    };
  } catch (error) {
    console.error('Error verifying document with TradeTrust:', error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
      errorDetails: error
    };
  }
}

export function prepareDocumentForBlockchain(document: any) {
  let documentHash;
  
  if (document.signature && document.signature.targetHash) {
    documentHash = document.signature.targetHash;
  } else if (document.documentHash) {
    documentHash = document.documentHash;
  } else {
    const documentData = utils.getDocumentData(document);
    const hash = require('crypto')
      .createHash('sha256')
      .update(JSON.stringify(documentData))
      .digest('hex');
    documentHash = hash;
  }
  
  return {
    documentHash,
    document
  };
}