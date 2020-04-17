import { GithubProfile } from '../Github'

export interface User {
  idx?: number
  id: string
  profile: GithubProfile
}