import {
  DocumentCreateResponse,
  HeaderDocumentReview,
} from '@/types/general-type'
import axios from 'axios'

const API_URL = import.meta.env.VITE_REACT_API_URL || ''

console.log('INI API URL: ', API_URL)

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const documentService = {
  createDocument: async (
    req: HeaderDocumentReview,
  ): Promise<DocumentCreateResponse> => {
    try {
      const res = await axiosInstance.post('/create', req)
      console.log('ini data createeee: ', res)
      console.log('ini data create ...data: ', res.data)

      return res.data
    } catch (err) {
      console.log('Error when: ', err)
      throw err
    }
  },
}

export default documentService
