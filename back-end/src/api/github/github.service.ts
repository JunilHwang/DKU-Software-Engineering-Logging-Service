import { Injectable } from '@nestjs/common'
import $http from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile } from '../../domain/Github'
import { httpResponseCheck } from '@/helper';

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
    return await httpResponseCheck($http.get(url, { params, headers: { ...headers, Authorization } }))
  }
  async getContent (user: string, repo: string, path: string): Promise<GithubContent> {
    const url = `${BASE_URL}/repos/${user}/${repo}/contents/${path}`
    return await httpResponseCheck($http.get(url, { headers }))
  }
  async getToken (code: string): Promise<GithubResponseToken> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    return await httpResponseCheck($http.post(`https://github.com/login/oauth/access_token`, params, { headers }))
  }
  async getProfile (token: string): Promise<GithubProfile> {
    const headers = { Authorization: `token ${token}` }
    return await httpResponseCheck($http.get(`${BASE_URL}/user`, { headers }))
  }
  // async getTree (user: string, repo: string, sha: string): Promise<GithubTree> {
  //
  // }
}
