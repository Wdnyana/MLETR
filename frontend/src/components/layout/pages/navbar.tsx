import { ModeToggle } from '@/components/ui/mode-toggle'

export function Navbar() {
  return (
    <nav className="responsive-container flex items-center justify-between py-3">
      <h1 className="text-center">NAVBAR HEADER</h1>
      <ModeToggle />
    </nav>
  )
}
