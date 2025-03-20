import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/ui/logout-button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { LoginEmailOTP } from '@/types/general-type'
import { Link } from 'react-router-dom'

export function NavbarDashboard({ token, setToken }: LoginEmailOTP) {
  return (
    <nav className="responsive-container flex items-center justify-between py-3">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-center">NAVBAR Dashboard</h3>

        <div className="flex items-center justify-between gap-4">
          <Button
            asChild
            className="rounded-xl px-5 py-[22px] text-base capitalize"
          >
            <Link to="/document/create">create document</Link>
          </Button>
          <Button
            asChild
            className="rounded-xl px-5 py-[22px] text-base capitalize"
          >
            <Link to="/document/verify">verify document</Link>
          </Button>

          <LogoutButton token={token} setToken={setToken} />

          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
