import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getMemories(type: 'short_term' | 'long_term' = 'short_term') {
  try {
    const tableName = `${type}_memories`
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(error.message)
    }

    console.log(`Supabase response for ${tableName}:`, data)
    return data || []
  } catch (error) {
    console.error('Failed to fetch memories:', error)
    throw error
  }
}
