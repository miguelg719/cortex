import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 10 // Revalidate every 10 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  // Convert from storageKey format to table name format
  const tableType = type === 'longTermMemory' ? 'long_term' : 'short_term'
  const tableName = `${tableType}_memories`

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { type, content } = await request.json()

  if (!type || (type !== 'short-term' && type !== 'long-term')) {
    return NextResponse.json({ error: 'Invalid memory type' }, { status: 400 })
  }

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

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
      throw new Error('Failed to generate embedding')
    }

    const { embedding } = await embeddingResponse.json()

    // Then insert the memory with the embedding
    const tableName = type === 'short-term' ? 'short_term_memories' : 'long_term_memories'
    const { data, error } = await supabase
      .from(tableName)
      .insert({ content, embedding })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    console.error('Error creating memory:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
