import { useState, useEffect, useCallback } from "react"

export interface MemoryItem {
  id: string
  content: string
  created_at: string
}

// Create a cache outside the hook to persist between renders
const memoryCache: Record<string, { data: MemoryItem[], timestamp: number }> = {}
const CACHE_DURATION = 10000 // Cache duration in milliseconds (10 seconds)

export function useMemory(type: "short-term" | "long-term") {
  const [memory, setMemory] = useState<MemoryItem[]>(() => {
    // Initialize from cache if available
    const cached = memoryCache[type]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(!memoryCache[type])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemories = async () => {
      // Check cache first
      const cached = memoryCache[type]
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setMemory(cached.data)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const apiType = type === "long-term" ? "longTermMemory" : "shortTermMemory"
        const response = await fetch(`/api/memories?type=${apiType}`)
        if (!response.ok) throw new Error('Failed to fetch memories')
        const data = await response.json()
        
        // Update cache
        memoryCache[type] = { data, timestamp: Date.now() }
        setMemory(data)
      } catch (error) {
        console.error('Error fetching memories:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch memories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemories()
  }, [type])

  const insertMemory = async (content: string) => {
    try {
      const apiType = type === "long-term" ? "long-term" : "short-term"
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: apiType, content }),
      })
      if (!response.ok) {
        throw new Error("Failed to insert memory")
      }
      const newMemory = await response.json()
      
      // Update both state and cache
      const newMemories = [newMemory, ...memory]
      setMemory(newMemories)
      memoryCache[type] = { data: newMemories, timestamp: Date.now() }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updateMemory = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/memories/${id}?type=${type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: type, content }),
      })
      if (!response.ok) {
        throw new Error("Failed to update memory")
      }
      const updatedMemory = await response.json()
      setMemory((prev) => prev.map((item) => (item.id === id ? updatedMemory : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const deleteMemory = async (id: string) => {
    try {
      const response = await fetch(`/api/memories/${id}?type=${type}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete memory")
      }
      
      // Update both state and cache
      const newMemories = memory.filter((item) => item.id !== id)
      setMemory(newMemories)
      memoryCache[type] = { data: newMemories, timestamp: Date.now() }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const searchMemory = useCallback((query: string) => {
    return memory.filter((item) => 
      item.content.toLowerCase().includes(query.toLowerCase())
    )
  }, [memory])

  return {
    memory,
    isLoading,
    error,
    insertMemory,
    updateMemory,
    deleteMemory,
    searchMemory,
  }
}

