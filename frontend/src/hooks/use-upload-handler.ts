import { useState, useCallback } from 'react'
import documentService from '@/service/service'

export function useUploadHandler(
  mode: 'Transferable' | 'Verifiable' | 'Create',
) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [uploading, setUploading] = useState<boolean>(false)
  const [createFile, setCreateFile] = useState<any>(null)

  // Define accepted file types based on mode
  const fileAccept: Record<string, string[]> =
    mode === 'Verifiable'
      ? { 'application/octet-stream': ['.tt'] }
      : { 'text/csv': ['.csv'], 'application/json': ['.json'] }

  // Handle file upload with progress tracking
  async function uploadFileProgress(file: File) {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setProgress(percentComplete)
        }
      })

      return new Promise<any>((resolve, reject) => {
        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText)
              console.log('Upload response:', res)
              setCreateFile(res)
              setUploadedFile(file)
              setUploading(false)
              resolve(res)
            } catch (parseError) {
              console.error('Error parsing response:', parseError)
              setError('Error processing server response')
              setUploading(false)
              reject(new Error('Error processing server response'))
            }
          } else {
            let errorMessage = `Upload failed with status ${xhr.status}: ${xhr.statusText}`
            
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              if (errorResponse.error) {
                errorMessage = errorResponse.error
              }
            } catch (e) {
              // Use default error message if parsing fails
            }
            
            setError(errorMessage)
            setUploading(false)
            reject(new Error(errorMessage))
          }
        }

        xhr.onerror = () => {
          const errorMessage = 'Network error occurred during upload'
          setError(errorMessage)
          setUploading(false)
          reject(new Error(errorMessage))
        }

        xhr.open(
          'POST',
          `${import.meta.env.VITE_REACT_API_URL}/api/v1/documents/upload`,
          true,
        )

        const token = localStorage.getItem('token')
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }

        xhr.send(formData)
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setError(errorMessage)
      setUploading(false)
      throw error
    }
  }

  // Alternative upload method using the document service
  async function uploadFileService(file: File) {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)
      
      // Simulate progress updates since the service doesn't provide them
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5
          return newProgress > 95 ? 95 : newProgress
        })
      }, 100)
      
      try {
        const response = await documentService.uploadFile(file)
        
        clearInterval(progressInterval)
        setProgress(100)
        setCreateFile(response)
        setUploadedFile(file)
        
        return response
      } catch (error) {
        clearInterval(progressInterval)
        throw error
      } finally {
        setUploading(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setError(errorMessage)
      throw error
    }
  }

  // Handle file drop
  const onDragAndDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      // Clear any previous errors
      setError(null)
      
      // Check file size (max 10MB)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit')
        return
      }
      
      // Attempt to upload the file
      uploadFileProgress(file).catch(error => {
        console.error('Upload failed:', error)
        setError(error instanceof Error ? error.message : 'Upload failed')
      })
    }
  }, [])

  // Handle rejected files
  const rejectedFile = useCallback(() => {
    setError(
      `Invalid file format. Please upload ${mode === 'Verifiable' ? 'a .tt file' : '.csv or .json files'}.`,
    )
  }, [mode])

  // Remove uploaded file
  function removeFileUpload() {
    setUploadedFile(null)
    setCreateFile(null)
    setProgress(0)
    setError(null)
  }

  return {
    uploadedFile,
    createFile,
    error,
    progress,
    uploading,
    fileAccept,
    onDragAndDrop,
    rejectedFile,
    removeFileUpload,
    uploadFileService, // Expose the service-based upload method
  }
}