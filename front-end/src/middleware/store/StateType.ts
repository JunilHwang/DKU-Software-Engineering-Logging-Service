import { GithubProfile, GithubRepository } from '../../../../back-end/src/domain/Github';

export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: GithubProfile
}
export type GithubState = {
  repositories: Array<GithubRepository>
}
