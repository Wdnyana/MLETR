import { Navbar } from './navbar'
import { Footer } from './footer'

import { TypesLayout } from '@/types/layout-type'

export default function MainLayout({ children }: TypesLayout) {
  return (
    <div className="grid-rows-layout grid h-screen w-full">
      <header className="">
        <Navbar />
      </header>

      <main className="responsive-container h-full py-5">{children}</main>

      <footer className="">
        <Footer />
      </footer>
    </div>
  )
}
