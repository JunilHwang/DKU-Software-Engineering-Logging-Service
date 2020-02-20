import { Injectable } from '@nestjs/common'
import $http from 'axios'
import {
  clientId as client_id,
  clientSecret as client_secret
} from './secret'

const headers = {
  Accept: 'application/vnd.github.v3+json'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {
  async getRepo(user: string): Promise<any> {
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const response = await $http.get(`${BASE_URL}/users/${user}/repos`, { params, headers });
    const { data, status } = response
    return status === 200 ? data : null
  }
  async getContent(user: string, repo: string, path: string): Promise<any> {
    const response = await $http.get(`${BASE_URL}/repos/${user}/${repo}/contents/${path}`, { headers });
    const { data, status } = response
    return status === 200 ? data : null
  }
  async getToken(code: string): Promise<any> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    const response = await $http.post(`https://github.com/login/oauth/access_token`, params, { headers });
    const { data, status } = response
    return status === 200 ? data : null
  }
}
