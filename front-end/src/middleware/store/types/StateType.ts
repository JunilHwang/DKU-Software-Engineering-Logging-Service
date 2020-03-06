import { GithubProfile, GithubRepository } from '@Domain';

export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: GithubProfile
}
export type GithubState = {
  repositories: GithubRepository[]
  content: string
  route: string
}
