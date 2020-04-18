import { Post } from '../index'

export interface SSRContext {
  url: string
  selectedPost?: Promise<Post|null>
}