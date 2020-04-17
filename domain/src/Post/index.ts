import { User } from '../User'
import { GithubProfile } from '../Github'

export interface Post {
  idx: number
  title: string
  content: string
  repository: string
  route: string
  description: string
  sha: string
  createdAt: number
  thumbnail: boolean
  writer: User
  likeUsers: User[]
}

export interface PostView {
  idx: number
  title: string
  description: string
  sha: string
  createdAt: number
  writerId: string
  writerProfile: GithubProfile
  comments: number
  likes: number
}

export interface PostVO {
  idx?: number
  title: string
  content: string
  repository: string
  route: string
  description: string
  thumbnail: string
  sha?: string
  createdAt?: number
}