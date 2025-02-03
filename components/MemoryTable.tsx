import { type FC } from 'react'
import type { MemoryItem } from '../hooks/useMemory'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash, Copy } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MemoryTableProps {
  memories: MemoryItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
  onRowClick: (memory: MemoryItem) => void
}

export const MemoryTable: FC<MemoryTableProps> = ({
  memories,
  onEdit,
  onDelete,
  onCopy,
  onRowClick,
}) => {
  if (!memories?.length) {
    return <div>No memories found</div>
  }

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memories.map(item => (
            <TableRow
              key={item.id}
              onClick={() => onRowClick(item)}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open actions menu">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(item.content)}>
                      <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Copy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="dropdown-menu-item-delete"
                    >
                      <Trash className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
