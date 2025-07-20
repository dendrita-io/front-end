export interface Note {
  id: string
  title: string
  subtitle: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  aiGenerated?: {
    title: string
    summary: string
    suggestedTags: string[]
  }
}
