export type ProfileType = {
  avatar_url: string
  login: string
}
export type RepositoryType = Array<any>
export type AccessToken = string|null

export type RootState = { }
export type UserState = {
  access_token: AccessToken
  profile: ProfileType
}
export type GithubState = {
  repository: RepositoryType
}
