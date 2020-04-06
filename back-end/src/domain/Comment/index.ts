import { User } from '../index'

export interface Comment {
  idx: number
  od: number
  content: string
  createdAt: number
  writer: User
  deleted: boolean
  parent: number
  post: number
  to: string
}

export interface CommentVO {
  content: string
  post: number
  parent?: number
  to?: string
}