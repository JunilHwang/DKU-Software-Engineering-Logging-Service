import { GithubProfile } from '../Github'
import { Post } from '../Post'

export interface User {
  idx: number
  id: string
  access_token: string
  profile: GithubProfile
  posts?: Post[]
}