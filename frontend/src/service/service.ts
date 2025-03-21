import {
  DocumentCreateResponse,
  HeaderDocumentReview,
} from '@/types/general-type';
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_API_URL || '';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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
  // Create document with document data
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

  // Upload file for document
  uploadFile: async (file: File): Promise<any> => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Update headers for file upload
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
      const errorMessage = err.response?.data?.error || 'File upload failed';
      throw new Error(errorMessage);
    }
  },

  // Check document job status
  checkJobStatus: async (jobId: string, queueName: string): Promise<any> => {
    try {
      const res = await axiosInstance.get(`/api/v1/documents/job-status/${queueName}/${jobId}`);
      return res.data;
    } catch (err) {
      console.error('Error checking job status:', err);
      const errorMessage = err.response?.data?.error || 'Failed to check job status';
      throw new Error(errorMessage);
    }
  },

  // Get document details
  getDocumentDetails: async (documentId: string): Promise<any> => {
    try {
      const res = await axiosInstance.get(`/api/v1/documents/${documentId}`);
      return res.data;
    } catch (err) {
      console.error('Error getting document details:', err);
      const errorMessage = err.response?.data?.error || 'Failed to get document details';
      throw new Error(errorMessage);
    }
  },

  // Get user documents
  getUserDocuments: async (): Promise<any> => {
    try {
      const res = await axiosInstance.get('/api/v1/documents/user');
      return res.data;
    } catch (err) {
      console.error('Error getting user documents:', err);
      const errorMessage = err.response?.data?.error || 'Failed to get user documents';
      throw new Error(errorMessage);
    }
  },
};

export default documentService;