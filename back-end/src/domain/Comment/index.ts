import { Post, User } from '../index'

export interface Comment {
  idx: number
  od: number
  depth: number
  content: string
  createdAt: number
  writer: User
  deleted: boolean
  parent: number
  post: number
}

export interface CommentVO {
  content: string
  post: number
  parent?: number
}