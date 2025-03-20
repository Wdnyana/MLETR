import { lazy, Suspense } from 'react'

import { LoginEmailOTP } from '@/types/general-type'
import Loading from '@/components/ui/loading'

const PagesLogin = lazy(() => import('./login'))
const DashboardPages = lazy(() => import('./dashboard'))
const CreateDocument = lazy(() => import('./create-document'))
const VerifyDocument = lazy(() => import('./verify-document.tsx'))
const ViewDocument = lazy(() => import('./view-document.tsx'))

export function WrapperLogin({ token, setToken }: LoginEmailOTP) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
        </div>
      }
    >
      <PagesLogin token={token} setToken={setToken} />
    </Suspense>
  )
}

export function WrapperDashboard({ token, setToken }: LoginEmailOTP) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
        </div>
      }
    >
      <DashboardPages token={token} setToken={setToken} />
    </Suspense>
  )
}

export function WrapperCreateDocument({ token, setToken }: LoginEmailOTP) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
        </div>
      }
    >
      <CreateDocument token={token} setToken={setToken} />
    </Suspense>
  )
}

export function WrapperVerifyDocument({ token, setToken }: LoginEmailOTP) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
        </div>
      }
    >
      <VerifyDocument token={token} setToken={setToken} />
    </Suspense>
  )
}

export function WrapperDocumentView({ token, setToken }: LoginEmailOTP) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
        </div>
      }
    >
      <ViewDocument
        token={token}
        setToken={setToken}
        type={{ type: 'Transferable' }}
      />
    </Suspense>
  )
}
