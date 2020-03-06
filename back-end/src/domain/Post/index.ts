import { User } from '../User'

export interface Post {
  idx: number
  title: string
  content: string
  repository: string
  sha: string
  reg_date: Date
  writer: User
}

export { PostVO } from './PostVO'