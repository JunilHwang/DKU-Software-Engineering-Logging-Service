import { GithubProfile, GithubRepository } from '@Domain/Github';

export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: GithubProfile
}
export type GithubState = {
  repositories: Array<GithubRepository>
}
