import { Injectable } from '@nestjs/common'
import $http from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile } from '../domain/Github'

const headers = { Accept: 'application/vnd.github.v3+json' }

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {
  async getRepo (user: string): Promise<Array<GithubRepository>> {
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const { data } = await $http.get(`${BASE_URL}/users/${user}/repos`, { params, headers });
    return data
  }
  async getContent (user: string, repo: string, path: string): Promise<GithubContent> {
    const { data } = await $http.get(`${BASE_URL}/repos/${user}/${repo}/contents/${path}`, { headers });
    return data
  }
  async getToken (code: string): Promise<GithubResponseToken> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    const { data } = await $http.post(`https://github.com/login/oauth/access_token`, params, { headers })
    return data
  }
  async getProfile (token: string): Promise<GithubProfile> {
    const headers = { Authorization: `token ${token}` }
    const { data } = await $http.get(`${BASE_URL}/user`, { headers })
    return data
  }
}
