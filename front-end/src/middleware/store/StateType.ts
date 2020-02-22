export type RootState = { }
export type RootModuleState = {
  user: UserState
  github: GithubState
}
export type UserState = {
  access_token: string|null
  profile: Object
}
export type GithubState = {
  repository: Array<Object>
}