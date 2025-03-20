import { useState, useCallback } from 'react'

export function useUploadHandler(
  mode: 'Transferable' | 'Verifiable' | 'Create',
) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [uploading, setUploading] = useState<boolean>(false)
  const [createFile, setCreateFile] = useState<any>(null)

  const fileAccept: Record<string, string[]> =
    mode === 'Verifiable'
      ? { 'application/octet-stream': ['.tt'] }
      : { 'text/csv': ['.csv'], 'application/json': ['.json'] }

  async function uploadFileProgress(file: File) {
    try {
      setUploading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append('file', file)

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
            const res = JSON.parse(xhr.responseText)
            setCreateFile(res)
            setUploadedFile(file)
            setUploading(false)
            resolve(res)
          } else {
            const errorMessage = `Upload failed with status ${xhr.status}: ${xhr.statusText}`
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
          `${import.meta.env.VITE_REACT_API_URL || ''}/documents/upload`,
          true,
        )

        const token = localStorage.getItem('token')
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }

        xhr.send(formData)
      })
    } catch (error) {
      setError('Upload failed: ' + (error as Error).message)
      setUploading(false)
      throw error
    }
  }

  const onDragAndDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      uploadFileProgress(acceptedFiles[0])
      setError(null)
    }
  }, [])

  const rejectedFile = useCallback(() => {
    setError(
      `Invalid file format. Please upload ${mode === 'Verifiable' ? 'a .tt file' : '.csv or .json files'}.`,
    )
  }, [mode])

  function removeFileUpload() {
    setUploadedFile(null)
    setCreateFile(null)
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
  }
}
