import { ArrowRight } from 'lucide-react'
import { Button } from './components/ui/button'

export default function NotFound() {
  return (
    <div className="responsive-container h-screen w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="bg-secondary rounded-md px-6 py-3 md:text-5xl xl:text-7xl">
          4 <span className="text-primary">0</span> 4
        </h1>
        <h3 className="my-5 md:text-3xl xl:text-5xl">Oopss! Page not found.</h3>
        <p className="text-center md:text-base">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist anymore.
        </p>

        <Button asChild className="mt-10 px-7 py-6 md:text-base">
          <a href="/authentication/login">
            Back to Home <ArrowRight />
          </a>
        </Button>
      </div>
    </div>
  )
}
