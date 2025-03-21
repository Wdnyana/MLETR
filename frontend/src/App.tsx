import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import RouterPages from './router'
import '@/styles/globals.css'
import Loading from './components/ui/loading.tsx'
import { magic } from './lib/magic-provider.ts'
import { isTokenExpired } from './components/utils/common.tsx'

export default function App() {
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user is logged in and token is valid
  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      
      const storedToken = localStorage.getItem('token') ?? ''
      
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          console.log('Token expired, logging out')
          localStorage.removeItem('token')
          setToken('')
          return false
        }
        
        if (storedToken.startsWith('did:')) {
          try {
            const isLoggedIn = await magic.user.isLoggedIn()
            if (!isLoggedIn) {
              console.log('Magic session expired, logging out')
              localStorage.removeItem('token')
              setToken('')
              return false
            }
          } catch (error) {
            console.error('Error checking Magic session:', error)
            return false
          }
        }
        
        setToken(storedToken)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error checking auth status:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    const handleStorageEvent = () => {
      const updatedToken = localStorage.getItem('token') ?? ''
      setToken(updatedToken)
    }

    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('storageUpdate', handleStorageEvent)

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('storageUpdate', handleStorageEvent)
    }
  }, [])

  // Handle protected route redirection
  useEffect(() => {
    const protectedRoutes = [
      '/dashboard',
      '/document/create',
      '/document/verify',
      // '/document-viewer',
    ]

    if (
      !loading &&
      !token &&
      protectedRoutes.some((route) => location.pathname.startsWith(route))
    ) {
      navigate('/authentication/login', { replace: true })
    }
  }, [token, navigate, location, loading])

  // Refresh auth status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        checkAuthStatus()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes
    
    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading className="md:h-16 md:w-16 2xl:h-20 2xl:w-20" />
      </div>
    )
  }

  const routes = RouterPages({ token, setToken })

  return (
    <Routes>
      {routes.map((route, i) => (
        <Route key={i} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}