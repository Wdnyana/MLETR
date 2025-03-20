import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Magic, PromiEvent } from 'magic-sdk'

export type { Magic } from '@/lib/magic-provider'

export type TypesClassNames = {
  className?: string
}

export type UploadFiles = {
  desc: string
  formatFile: string
  mode: 'Transferable' | 'Verifiable' |
  className?: string
  selectedExchange?: string | null
  alertView?: boolean
  setAlertView?: (value: boolean) => void
  onUploadSuccess?: () => void
}

export type DragAndDropFiles = {
  desc: string
  formatFile: string
  error: string | null
  uploading: boolean
  progress: number
  uploadedFile: File | null
  onDragAndDrop: (acceptedFiles: File[]) => void
  rejectedFiles: () => void
  removeFile: () => void
  fileAccept: Record<string, string[]>
}
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export type SearchForms = {
  search?: string
  searchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & React.ComponentProps<'form'>

export type TypesDocument = {
  id: string
  name: string
  description: string
}[]

export type SelectTypes = {
  setSelectTypeDoc: (type: string) => void
  selected: string
  alert: boolean
  setAlert: (value: boolean) => void
}

export type DocumentNames = {
  fileName: string
  setFileName: (name: string) => void
  uploadedFile: File | null
  alert: boolean
  setAlert: (value: boolean) => void
}

export type DownloadDocuments = {
  fileName: string
  onReset: () => void
  alert: boolean
  setAlert: (value: boolean) => void
}

export type SelectExchanges = {
  onSelect: (value: string) => void
  error?: boolean
}

export type HeaderDocumentReview = {
  type: 'Transferable' | 'Verifiable'
  metadata?: Record<string, any>
  fileName?: string
}

export type DocumentCreateResponse = {
  message: string
  document: any
  job: {
    id: string
    statusCheckEndpoint: string
  }
}

export type LoginEmailOTP = {
  token: string
  setToken: React.Dispatch<SetStateAction<string>>
  type?: HeaderDocumentReview
}

export type OTPTypes = {
  loginOtp?: PromiEvent<string | null>
  cancelOTP: any
}

export type ButtonPropsLogout = {
  setToken: Dispatch<SetStateAction<string>>
  magic: Magic | InstanceType<typeof Magic> | null
  navigate: (path: string) => void
}

export type LogoutComponentsProps = {
  text: string
  isDisconnect?: boolean
  onClick: () => void
}

export type ProtectedRouteDashboard = {
  children: ReactNode
}

export type RouteTypes = {
  path: string
  element: React.ReactNode
  protected: boolean
}
