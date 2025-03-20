import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { TypesClassNames } from '@/types/general-type'

export default function Loading({ className }: TypesClassNames) {
  return (
    <>
      <Loader2
        className={cn('h-12 w-12', className)}
        style={{ animation: 'spin 1s linear infinite' }}
      />
    </>
  )
}
