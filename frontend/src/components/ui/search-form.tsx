import { Search } from 'lucide-react'

import { Label } from '@/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@/components/ui/sidebar'
import { SearchForms } from '@/types/general-type'

export function SearchForm({ search, searchChange, ...props }: SearchForms) {
  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the documents..."
            className="py-4 pl-8 md:text-base"
            value={search}
            onChange={(e) => searchChange?.(e)}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
