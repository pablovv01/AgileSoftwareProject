import {Comment} from './comment';

export interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  userId: string
  createdAt: string
  visualizations: number
  authorName?: string
  authorPhoto?: string
  isFavourited?: boolean
  comments: Comment[]
  likes: number;
}
