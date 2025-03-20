'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Documents } from '@/types/table'
import { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'

function backgroundStatus(status: string) {
  switch (status) {
    case 'Verified':
      return 'bg-green-800 text-white'
    case 'Transfer':
      return 'bg-blue-600 text-white'
    case 'Created':
      return 'bg-purple-500 text-white'
    default:
      return 'bg-gray-400 text-black'
  }
}

export const columns: ColumnDef<Documents>[] = [
  {
    accessorKey: 'name',
    header: 'Document Name',
    filterFn: 'includesString',
    enableGlobalFilter: true,
    cell: ({ row }) => <div className="max-w-[150px]">{row.original.name}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'includesString',
    enableGlobalFilter: true,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Badge
            className={`rounded-md px-3 py-1 ${backgroundStatus(row.original.status)}`}
          >
            {row.original.status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return <p className="text-center">{row.original.date}</p>
    },
  },
  {
    accessorKey: 'verifyBy',
    header: 'Verified By',
    filterFn: 'includesString',
    enableGlobalFilter: true,
    cell: ({ row }) => {
      return <p className="text-center">{row.original.verifyBy}</p>
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Button
            variant="outline"
            size="icon"
            onClick={row.original.action}
            className="cursor-pointer"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      )
    },
  },
]
