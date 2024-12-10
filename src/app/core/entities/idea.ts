import {Comment} from '@angular/compiler';

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
  comments: Comment[]
}
