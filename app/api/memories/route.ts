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

  const { data, error } = await supabase
    .from(type === 'short-term' ? 'short_term_memories' : 'long_term_memories')
    .insert({ content })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
