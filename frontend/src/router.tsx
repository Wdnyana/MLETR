// router.tsx - ubah implementasi dari RouterPages
import { Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from '@/components/ui/loading'
import NotFound from './not-found.tsx'
import {
  WrapperCreateDocument,
  WrapperDashboard,
  WrapperLogin,
  WrapperVerifyDocument,
  WrapperDocumentView,
} from './pages/wrapper.tsx'

import { LoginEmailOTP } from '@/types/general-type'
import TransferableDocumentViewer from './components/dashboard/TransferableDocumentViewer.tsx'

export default function RouterPages({ token, setToken }: LoginEmailOTP) {
  const protectedRoutes = token
    ? [
        {
          path: '/dashboard',
          element: <WrapperDashboard token={token} setToken={setToken} />,
          protected: true,
        },
        {
          path: '/document/create',
          element: <WrapperCreateDocument token={token} setToken={setToken} />,
          protected: true,
        },
        {
          path: '/document/verify',
          element: <WrapperVerifyDocument token={token} setToken={setToken} />,
          protected: true,
        },
        {
          path: '/document/:id',
          element: <WrapperDocumentView token={token} setToken={setToken} />,
          protected: true,
        },
        {
          path: '/document/transferable/:id',
          element: <TransferableDocumentViewer token={token} setToken={setToken} />,
          protected: true,
        },
      ]
    : []

  const publicRoutes = [
    {
      path: '/',
      element: <Navigate to="/authentication/login" replace />,
      protected: false,
    },
    {
      path: '/authentication/login',
      element: <WrapperLogin token={token} setToken={setToken} />,
      protected: false,
    },
    {
      path: '/document-viewer',
      element: (
        <WrapperDocumentView
          token={token}
          setToken={setToken}
          type={{ type: 'Transferable' }}
        />
      ),
      protected: false,
    },
    {
      path: '*',
      element: (
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
            </div>
          }
        >
          <NotFound />
        </Suspense>
      ),
      protected: false,
    },
  ]

  return [...publicRoutes, ...protectedRoutes]
}
