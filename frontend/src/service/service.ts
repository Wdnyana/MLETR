import {
  DocumentCreateResponse,
  HeaderDocumentReview,
} from '@/types/general-type';
import axios from 'axios';
import { formatToOpenAttestation, parseFromOpenAttestation } from './document-formater';
import { verifyTradeTrustDocument, prepareDocumentForBlockchain } from './document-formater';


const API_URL = import.meta.env.VITE_REACT_API_URL || '';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const documentService = {
  createDocument: async (req: HeaderDocumentReview): Promise<DocumentCreateResponse> => {
    try {
      console.log('Creating document with data:', req);
      const res = await axiosInstance.post('/api/v1/documents/create', req);
      console.log('Document creation response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error creating document:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Document creation failed';
      throw new Error(errorMessage);
    }
  },

  uploadFile: async (file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      console.log('Uploading file:', file.name);
      const res = await axiosInstance.post('/api/v1/documents/upload', formData, config);
      console.log('File upload response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error uploading file:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'File upload failed';
      throw new Error(errorMessage);
    }
  },

  checkJobStatus: async (jobId: string, queueName: string): Promise<any> => {
    try {
      const res = await axiosInstance.get(`/api/v1/documents/job-status/${queueName}/${jobId}`);
      return res.data;
    } catch (err) {
      console.error('Error checking job status:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to check job status';
      throw new Error(errorMessage);
    }
  },

  getDocumentDetails: async (documentId: string): Promise<any> => {
    try {
      const res = await axiosInstance.get(`/api/v1/documents/${documentId}`);
      return res.data;
    } catch (err) {
      console.error('Error getting document details:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to get document details';
      throw new Error(errorMessage);
    }
  },

  getUserDocuments: async (): Promise<any> => {
    try {
      const res = await axiosInstance.get('/api/v1/documents/user');
      return res.data;
    } catch (err) {
      console.error('Error getting user documents:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to get user documents';
      throw new Error(errorMessage);
    }
  },

  downloadDocument: async (documentId: string): Promise<Blob> => {
    try {
      console.log('Downloading document:', documentId);
      
      const res = await axiosInstance.get(`/api/v1/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      console.log('Download response headers:', res.headers);
      console.log('Download response type:', res.data.type);
      
      const contentType = res.headers['content-type'] || '';
      
      if (contentType.includes('application/json') || contentType.includes('text/plain')) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              let documentData;
              try {
                documentData = JSON.parse(reader.result as string);
              } catch (e) {
                documentData = { data: reader.result };
              }
              
              const formattedDocument = formatToOpenAttestation(documentData);
              const jsonStr = JSON.stringify(formattedDocument, null, 2);
              const blob = new Blob([jsonStr], { type: 'application/octet-stream' });
              console.log('Created formatted document blob:', blob.size);
              resolve(blob);
            } catch (error) {
              console.error('Error formatting document:', error);
              reject(error);
            }
          };
          reader.onerror = (error) => {
            console.error('Error reading blob:', error);
            reject(error);
          };
          reader.readAsText(res.data);
        });
      }
      
      console.log('Returning raw blob:', res.data.size);
      return res.data;
    } catch (err) {
      console.error('Error downloading document:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to download document';
      throw new Error(errorMessage);
    }
  },

  downloadAllDocuments: async (): Promise<Blob> => {
    try {
      const res = await axiosInstance.get('/api/v1/documents/download-all', {
        responseType: 'blob'
      });
      return res.data;
    } catch (err) {
      console.error('Error downloading all documents:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to download all documents';
      throw new Error(errorMessage);
    }
  },

  verifyTradeTrustDocument: async (documentData: any): Promise<any> => {
    try {
      console.log('Document being verified:', documentData);
      
      const clientVerification = await verifyTradeTrustDocument(documentData);
      
      console.log('Client-side verification result:', clientVerification);
      if (!clientVerification.verified) {
        console.log('Client-side verification:', clientVerification);
        console.error('Client-side verification failed:', clientVerification);
        return clientVerification;
      }

      console.log('Client-side verification passed:', clientVerification);
      const documentHash  = documentData.signature?.targetHash;
      
      if (!documentHash) {
        console.error('Document hash not found in the document data');
        return {
          verified: false,
          error: 'Document hash not found',
          verification: {
            client: clientVerification.verification
          }
        };
      }

      console.log('Using document hash for verification:', documentHash);

  
      const res = await axiosInstance.post('/api/v1/documents/verify-tradetrust', {
        documentHash
      });
  
      return {
        verified: res.data.verified && clientVerification.verified,
        document: parseFromOpenAttestation(documentData),
        verification: {
          client: clientVerification.verification,
          blockchain: res.data
        }
      };
    } catch (err) {
      console.error('Error verifying document:', err);
      
      let errorMessage = 'Failed to verify document';
      let errorDetails = {};
      
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || 'Network error during verification';
        errorDetails = {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        };
      }
      
      return {
        verified: false,
        error: errorMessage,
        errorDetails,
        document: documentData
      };
    }
  },
  transferDocument: async (documentId: string, newHolder: string): Promise<any> => {
    try {
      const res = await axiosInstance.post(`/api/v1/documents/${documentId}/transfer`, {
        newHolder
      });
      return res.data;
    } catch (err) {
      console.error('Error transferring document:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to transfer document';
      throw new Error(errorMessage);
    }
  },

  getDocumentHistory: async (documentId: string): Promise<any> => {
    try {
      const res = await axiosInstance.get(`/api/v1/documents/${documentId}/history`);
      return res.data;
    } catch (err) {
      console.error('Error getting document history:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to get document history';
      throw new Error(errorMessage);
    }
  }
};

export default documentService;