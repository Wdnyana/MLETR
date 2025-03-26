import {
  DocumentCreateResponse,
  HeaderDocumentReview,
} from '@/types/general-type';
import axios from 'axios';

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
      const res = await axiosInstance.get(`/api/v1/documents/${documentId}/download`, {
        responseType: 'blob'
      });
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

  verifyDocument: async (documentId: string, documentHash?: string): Promise<any> => {
    try {
      const res = await axiosInstance.post(`/api/v1/documents/${documentId}/verify`, {
        documentHash
      });
      return res.data;
    } catch (err) {
      console.error('Error verifying document:', err);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.error || 'Failed to verify document';
      throw new Error(errorMessage);
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