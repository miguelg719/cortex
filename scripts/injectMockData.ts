import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const shortTermMockData = [
  { content: 'Current task: Analyze market trends' },
  { content: 'User preference: Dark mode' },
  { content: "Recent query: What's the weather like?" },
  { content: 'Active session ID: 12345' },
  { content: 'Last API call: GET /users/profile' },
]

const longTermMockData = [
  {
    content:
      'User Profile: John Doe is a 35-year-old software engineer from San Francisco. He has been using our platform for 2 years and frequently engages with AI-related content. John prefers concise explanations and practical examples in his interactions.',
  },
  {
    content:
      'Project History: The AI-assisted code refactoring project for client XYZ was completed successfully last quarter. The team utilized advanced natural language processing techniques to analyze and improve code quality across 500,000 lines of legacy code.',
  },
  {
    content:
      'Learning Preferences: Based on interaction history, the optimal learning approach for this user involves a combination of visual aids (diagrams, charts) and hands-on coding exercises. The user responds well to analogies that relate complex AI concepts to everyday experiences.',
  },
  {
    content:
      'Frequently Asked Questions: The user often inquires about advanced machine learning algorithms, particularly in the areas of natural language processing and computer vision.',
  },
  {
    content:
      'Collaboration History: Has participated in three open-source AI projects over the past year, contributing primarily to documentation and testing phases.',
  },
]

async function injectMockData() {
  try {
    // Insert short-term memories
    const { data: shortTermData, error: shortTermError } = await supabase
      .from('short_term_memories')
      .insert(shortTermMockData)
      .select()

    if (shortTermError) throw shortTermError
    console.log('Short-term memories inserted:', shortTermData)

    // Insert long-term memories
    const { data: longTermData, error: longTermError } = await supabase
      .from('long_term_memories')
      .insert(longTermMockData)
      .select()

    if (longTermError) throw longTermError
    console.log('Long-term memories inserted:', longTermData)

    console.log('Mock data injection completed successfully')
  } catch (error) {
    console.error('Error injecting mock data:', error)
  } finally {
    process.exit()
  }
}

injectMockData()
