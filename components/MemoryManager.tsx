import type React from "react"
import { useState } from "react"
import { useMemory } from "../hooks/useMemory"
import { MemoryTable } from "./MemoryTable"
import { InsertMemoryDialog } from "./InsertMemoryDialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus } from "lucide-react"
import { MemoryDetailDialog } from "./MemoryDetailDialog"
import type { MemoryItem } from "../hooks/useMemory"
import { Button } from "@/components/ui/button"
import { MemoryTableSkeleton } from "./MemoryTableSkeleton"

interface MemoryManagerProps {
  title: string
  storageKey: "shortTermMemory" | "longTermMemory"
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({ title, storageKey }) => {
  const memoryType = storageKey === "longTermMemory" ? "long-term" : "short-term"
  const { memory, insertMemory, updateMemory, deleteMemory, searchMemory, isLoading } = useMemory(memoryType)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleInsert = (content: string) => {
    insertMemory(content)
    toast({
      title: "Memory Inserted",
      description: "A new memory has been added to the database.",
    })
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    // Implement edit functionality here
  }

  const handleDelete = (id: string) => {
    deleteMemory(id)
    toast({
      title: "Memory Deleted",
      description: "The memory has been removed from the database.",
    })
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The memory content has been copied to your clipboard.",
      })
    })
  }

  const handleRowClick = (memory: MemoryItem) => {
    setSelectedMemory(memory)
    setIsDetailOpen(true)
  }

  const filteredMemory = searchQuery ? searchMemory(searchQuery) : memory

  return (
    <section aria-labelledby={`${storageKey}-title`}>
      <div className="flex justify-between items-center mb-4 bg-white">
        <h2 id={`${storageKey}-title`} className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <InsertMemoryDialog onInsert={handleInsert} memoryType={title}>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            New Memory
          </Button>
        </InsertMemoryDialog>
      </div>
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${title}`}
            className="pl-8 w-full"
            aria-label={`Search ${title}`}
          />
        </div>
      </div>
      {isLoading ? (
        <MemoryTableSkeleton />
      ) : (
        <MemoryTable
          memories={filteredMemory}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onRowClick={handleRowClick}
        />
      )}
      <MemoryDetailDialog memory={selectedMemory} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </section>
  )
}

