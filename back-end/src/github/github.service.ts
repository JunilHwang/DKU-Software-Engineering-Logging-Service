import { Injectable } from '@nestjs/common'
import $http from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile } from '../domain/Github'

const headers = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'request'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {
  async getRepo (user: string, access_token: string): Promise<Array<GithubRepository>> {
    const Authorization = `token ${access_token}`
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const url = `${BASE_URL}/users/${user}/repos`
    const { data } = await $http.get(url, { params, headers: { ...headers, Authorization } })
    return data
  }
  async getContent (user: string, repo: string, path: string): Promise<GithubContent> {
    const url = `${BASE_URL}/repos/${user}/${repo}/contents/${path}`
    const { data } = await $http.get(url, { headers })
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
