export type ProfileType = any
export type RepositoryType = any

export type RootState = { }
export type UserState = {
  access_token: string|null
  profile: ProfileType
}
export type GithubState = {
  repository: Array<Object>
}