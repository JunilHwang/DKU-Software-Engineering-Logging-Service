import { GithubRepository } from './Repository';
import { GithubProfile } from './Profile';
import { User } from '../index'

export interface GithubHookConfig {
  content_type: 'json',
  insecure_ssl: '0'|'1',
  url: string
}

export interface GithubHookLastResponse {
  code: null|string,
  status: string,
}

export interface GithubHookData {
  type: string,
  id: string,
  name: string,
  active: boolean,
  events: string[],
  config: GithubHookConfig,
  updated_at: string,
  created_at: string,
  url: string,
  test_url: string,
  ping_url: string,
  last_response: GithubHookLastResponse
  message: null|string
}

export interface GithubCommitUser {
  name: string
  email: string
  username?: string
}

export interface GithubCommit {
  id: string,
  tree_id: string,
  distinct: boolean,
  message: string,
  timestamp: string,
  url: string,
  author: GithubCommitUser[],
  committer: GithubCommitUser[],
  added: string[],
  removed: string[],
  modified: string[]
}

export interface GithubHookPayload {
  ref: string,
  before: string,
  after: string,
  repository: GithubRepository,
  pusher: GithubCommitUser,
  sender: GithubProfile,
  created: boolean,
  deleted: boolean,
  forced: boolean,
  base_ref: null|string,
  compare: string,
  commits: GithubCommit[],
  head_commit: GithubCommit
}

export interface GithubHook {
  idx: number
  repo: string
  user: User
  data: GithubHookData
}