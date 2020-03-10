import { User } from '../User'

export interface Post {
  idx: number
  title: string
  content: string
  repository: string
  sha: string
  createdAt: number
  updatedAt: number
  writer: User
}

export { PostVO } from './PostVO'