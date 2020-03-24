import { Post, User } from '@/domain'

export interface Comment {
  id: number
  content: string
  createdAt: number
  writer: User
  post?: Post
  children?: Comment[]
}