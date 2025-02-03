import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy } from 'lucide-react'
import type { MemoryItem } from '../hooks/useMemory'
import { useToast } from '@/components/ui/use-toast'

interface MemoryDetailDialogProps {
  memory: MemoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemoryDetailDialog({ memory, open, onOpenChange }: MemoryDetailDialogProps) {
  const { toast } = useToast()

  if (!memory) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(memory.content).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Memory content has been copied.',
      })
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Memory</DialogTitle>
          <DialogDescription>Created on {formatDate(memory.created_at)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg text-sm">{memory.content}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
