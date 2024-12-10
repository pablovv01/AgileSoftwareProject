export interface Comment{
  userId: string,
  authorName: string,
  publishedDate: string,
  content: string,
  reply: Comment[]
  private: boolean
}
