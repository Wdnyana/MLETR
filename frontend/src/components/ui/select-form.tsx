import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { exchanges } from '@/types/data-exchanges'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { SelectExchanges } from '@/types/general-type'

export function SelectForm({ onSelect, error }: SelectExchanges) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')

  const handleSelect = (newValue: string) => {
    setValue(newValue)
    onSelect(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-[200px] justify-between', error && 'border-red-500')}
        >
          {value
            ? exchanges.find((exc) => exc.value === value)?.label
            : 'Select Exchanges...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search exchange..." />
          <CommandList>
            <CommandEmpty>No exchange found.</CommandEmpty>
            <CommandGroup>
              {exchanges.map((exchange) => (
                <CommandItem
                  key={exchange.value}
                  onSelect={() => handleSelect(exchange.value)}
                >
                  {exchange.label}
                  {value === exchange.value && (
                    <Check className="ml-auto opacity-50" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
