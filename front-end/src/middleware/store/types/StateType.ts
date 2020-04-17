export type AccessToken = string|null
export type RootState = {
  user?: any
  github?: any
  post?: any
  comment?: any
  [k: string]: string
}