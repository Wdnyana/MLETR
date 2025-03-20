import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import RouterPages from './router'
import '@/styles/globals.css'
import Loading from './components/ui/loading.tsx'

export default function App() {
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedToken = localStorage.getItem('token') ?? ''
    setToken(storedToken)
    setLoading(false)

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
  }, [setToken])

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
