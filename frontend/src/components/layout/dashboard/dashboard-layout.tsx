import { TypesLayout } from '@/types/layout-type'
import { NavbarDashboard } from './navbar-dashboard'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: TypesLayout) {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '')
  }, [setToken])

  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr]">
      <header className="">
        <NavbarDashboard token={token} setToken={setToken} />
      </header>

      <main className="responsive-container h-full py-5">{children}</main>
    </div>
  )
}
