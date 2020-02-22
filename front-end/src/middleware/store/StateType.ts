export type ProfileType = any
export type RepositoryType = any
export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: ProfileType
}
export type GithubState = {
  repository: Array<Object>
}
