"use client"
import { MemoryManager } from "../../components/MemoryManager"
import { Toaster } from "@/components/ui/toaster"
import { Layout } from "../../components/Layout"

export default function LongTermMemoryPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <MemoryManager title="Long-term Memory" storageKey="longTermMemory" />
      </div>
      <Toaster />
    </Layout>
  )
}

