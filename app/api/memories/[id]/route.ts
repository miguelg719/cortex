import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (!type || (type !== 'short-term' && type !== 'long-term')) {
    return NextResponse.json({ error: 'Invalid memory type' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from(type === 'short-term' ? 'short_term_memories' : 'long_term_memories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = params.id
  const { content } = await request.json()

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  // Convert type to table name
  const tableName = type === 'long-term' ? 'long_term_memories' : 'short_term_memories'

  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = params.id

  // Convert type to table name
  const tableName = type === 'long-term' ? 'long_term_memories' : 'short_term_memories'

  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 })
  }
}
