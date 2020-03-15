import { GithubProfile, GithubRepository, Post, User } from '@Domain';

export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: GithubProfile
  posts: Post[]
  user: User|null
}
export type GithubState = {
  repositories: GithubRepository[]
  content: string
  route: string
}
export type PostState = {
  selectedPost: Post|null
  postList: Post[]
}
