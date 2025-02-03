'use client'
import { MemoryManager } from '../components/MemoryManager'
import { Toaster } from '@/components/ui/toaster'
import { Layout } from '../components/Layout'
import { usePathname } from 'next/navigation'

export default function CortexAIMemoryPlatform() {
  const pathname = usePathname()

  return (
    <Layout>
      <div className="space-y-8">
        {pathname === '/' && (
          <MemoryManager title="Short-term Memory" storageKey="shortTermMemory" />
        )}
        {pathname === '/long-term' && (
          <MemoryManager title="Long-term Memory" storageKey="longTermMemory" />
        )}
      </div>
      <Toaster />
    </Layout>
  )
}
