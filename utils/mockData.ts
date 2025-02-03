export const mockShortTermMemory = [
  { id: "1", content: "Current task: Analyze market trends", timestamp: new Date().toISOString() },
  { id: "2", content: "User preference: Dark mode", timestamp: new Date(Date.now() - 3600000).toISOString() },
  {
    id: "3",
    content: "Recent query: What's the weather like?",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
]

export const mockLongTermMemory = [
  {
    id: "1",
    content:
      "User Profile: John Doe is a 35-year-old software engineer from San Francisco. He has been using our platform for 2 years and frequently engages with AI-related content. John prefers concise explanations and practical examples in his interactions.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    content:
      "Project History: The AI-assisted code refactoring project for client XYZ was completed successfully last quarter. The team utilized advanced natural language processing techniques to analyze and improve code quality across 500,000 lines of legacy code.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    content:
      "Learning Preferences: Based on interaction history, the optimal learning approach for this user involves a combination of visual aids (diagrams, charts) and hands-on coding exercises. The user responds well to analogies that relate complex AI concepts to everyday experiences.",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
]

