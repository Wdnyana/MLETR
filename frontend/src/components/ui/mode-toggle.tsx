import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { useTheme } from '@/components/provider/theme-provider'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="toggleMode" size="toggleMode">
          {theme === 'dark' ? (
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="shadow-input mt-2 border-none"
        align="center"
      >
        <DropdownMenuItem
          className="m-1 cursor-pointer ps-4 text-center md:text-start"
          onClick={() => setTheme('dark')}
        >
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          className="m-1 cursor-pointer ps-4 text-center md:text-start"
          onClick={() => setTheme('light')}
        >
          Light
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
