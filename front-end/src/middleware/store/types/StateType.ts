import { Post } from 'domain/dist'

export type AccessToken = string|null
export type RootState = {
  user?: any
  github?: any
  post?: any
  comment?: any
  selectedPost?: Post|null
}