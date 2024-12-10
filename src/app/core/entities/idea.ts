export interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  userId: string
  createdAt: string
  authorName?: string
  authorPhoto?: string
  isFavourited?: boolean
}