import { supabase } from './supabase'

export async function generateEmbeddings(table: string, id: string, content: string) {
  try {
    // First, generate the embedding
    const embeddingResponse = await fetch('http://localhost:54321/functions/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: content }),
    })

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embeddings')
    }

    const { embedding } = await embeddingResponse.json()
    console.log('Generated embedding for content:', content)
    console.log('Embedding:', embedding)

    // Then update the record with the embedding
    const { error } = await supabase
      .from(table)
      .update({ embedding })
      .eq('id', id)

    if (error) {
      console.error('Error storing embedding:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in generateEmbeddings:', error)
    return false
  }
}

export async function searchSimilarMemories(table: string, query: string, limit = 5) {
  try {
    // First, get embedding for the search query
    const embeddingResponse = await fetch('http://localhost:54321/functions/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: query }),
    })

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate search embedding')
    }

    const { embedding } = await embeddingResponse.json()
    console.log('Generated search embedding:', embedding)

    // Then search for similar memories using the embedding
    const { data: memories, error } = await supabase
      .rpc('match_memories', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        table_name: table
      })

    if (error) {
      console.error('Search error:', error)
      throw error
    }

    console.log('Search results:', memories)
    return memories
  } catch (error) {
    console.error('Error searching memories:', error)
    return []
  }
}

interface MemoryWithSimilarity {
  id: string
  content: string
  created_at: string
  similarity: number
}

export async function searchAllMemories(query: string, limit = 5) {
  try {
    // First, get embedding for the search query
    const embeddingResponse = await fetch('http://localhost:54321/functions/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: query }),
    })

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate search embedding')
    }

    const { embedding } = await embeddingResponse.json()
    console.log('Generated search embedding:', embedding)

    // Search both tables and combine results
    const [shortTermResults, longTermResults] = await Promise.all([
      supabase.rpc('match_memories', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        table_name: 'short_term_memories'
      }),
      supabase.rpc('match_memories', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        table_name: 'long_term_memories'
      })
    ])

    console.log('Short term results:', shortTermResults)
    console.log('Long term results:', longTermResults)

    if (shortTermResults.error) {
      console.error('Short term search error:', shortTermResults.error)
    }
    if (longTermResults.error) {
      console.error('Long term search error:', longTermResults.error)
    }

    // Combine and sort results by similarity
    const allMemories = [
      ...(shortTermResults.data || []).map((m: MemoryWithSimilarity) => ({ ...m, type: 'short-term' })),
      ...(longTermResults.data || []).map((m: MemoryWithSimilarity) => ({ ...m, type: 'long-term' }))
    ].sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    console.log('Combined results:', allMemories)
    return allMemories

  } catch (error) {
    console.error('Error searching memories:', error)
    return []
  }
}

// Add a type for the search results
export interface SearchResult {
  id: string
  content: string
  similarity: number
  type: 'short-term' | 'long-term'
  created_at: string
} 