import { Injectable } from '@nestjs/common'
import { default as $http, AxiosResponse } from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob, GithubHookData } from '@/domain/Github'
import { defaultAccessToken as token } from './secret'

const BASE_URL = 'https://api.github.com'

export const adapter = async <T>(response: Promise<AxiosResponse>): Promise<T> => {
  try {
    const { statusText, status, config: { method, url }, data, headers } = await response
    if (process.env.NODE_ENV !== 'production') {
      console.log(method, url, status, statusText)
      console.log('X-Ratelimit-Remaining: ', headers['x-ratelimit-remaining'])
    }
    return data
  } catch (e) {
    console.error('adapter: ', response)
    throw e
  }
}

@Injectable()
export class GithubAdapter {

  public getRepo (user: string): Promise<GithubRepository[]> {
    const headers = { Authorization: `Basic ${token}` }
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const url = `${BASE_URL}/users/${user}/repos`
    return adapter<GithubRepository[]>($http.get(url, { params, headers }))
  }

  public getContent ({ user, repo, path }: { [k: string]: string }): Promise<GithubContent> {
    const headers = { Authorization: `Basic ${token}` }
    const url = `${BASE_URL}/repos/${user}/${repo}/contents/${path}`
    return adapter<GithubContent>($http.get(url, { headers }))
  }

  public getToken (code: string): Promise<GithubResponseToken> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    const url = 'https://github.com/login/oauth/access_token'
    return adapter<GithubResponseToken>($http.post(url, params, { headers }))
  }

  public getProfile (token: string): Promise<GithubProfile> {
    const headers = { Authorization: `token ${token}` }
    const url = `${BASE_URL}/user`
    return adapter<GithubProfile>($http.get(url, { headers }))
  }

  public getTrees ({ user, repo, sha }: { [k: string]: string }): Promise<GithubTrees> {
    const headers = { Authorization: `Basic ${token}` }
    const url = `${BASE_URL}/repos/${user}/${repo}/git/trees/${sha}`
    return adapter<GithubTrees>($http.get(url, { headers }))
  }

  public getBlob ({ user, repo, sha }: { [k: string]: string }): Promise<GithubBlob> {
    const headers = { Authorization: `Basic ${token}` }
    const url = `${BASE_URL}/repos/${user}/${repo}/git/blobs/${sha}`
    return adapter<GithubBlob>($http.get(url, { headers }))
  }

  public postHook ({ repo, access_token }: { [k: string]: string }): Promise<GithubHookData> {
    const url = `${BASE_URL}/repos/${repo}/hooks`
    const configURL = process.env.NODE_ENV === 'development'
                      ? 'http://49.172.17.25:8080'
                      : 'http://localhost:8080' // 추후에 변경 예
    const data = {
      name: 'web',
      active: true,
      events: [ 'push' ],
      config: {
        url: `${configURL}/api/github/hook/commit`,
        content_type: 'json',
        insecure_ssl: 0
      }
    }

    const headers = { Authorization: `token ${access_token}` }
    return adapter<GithubHookData>($http.post(url, data, { headers }))
  }

  public removeHook ({ repo, token, id }: { [k: string]: string }): Promise<void> {
    const headers = { Authorization: `token ${token}` }
    const url = `${BASE_URL}/repos/${repo}/hooks/${id}`
    return adapter<void>($http.delete(url, { headers }))
  }

}
