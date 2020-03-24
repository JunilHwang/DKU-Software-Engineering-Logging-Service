import { Post, User } from '@/domain'

export interface Comment {
  idx: number
  od: number
  depth: number
  content: string
  createdAt: number
  writer: User
  parent?: Comment
  post?: Post
}

export interface CommentVO {
  content: string
  post: number
  parent?: number
}