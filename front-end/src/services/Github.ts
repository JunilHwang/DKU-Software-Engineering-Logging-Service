import $http from 'axios'
import { Base64 } from 'js-base64'

const baseURI = '/api/github'

interface ContentVO {
  user: string
  repo: string
  path: string
}

const Github = class {
  async getRepo (user: string): Promise<any> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    return data.result
  }

  async getContent (params: ContentVO): Promise<any> {
    const { data } = await $http.get(`${baseURI}/content`, { params })
    return Base64.decode(data.result.content)
  }

  async getDirectory (params: ContentVO): Promise<any> {
    const { data } = await $http.get(`${baseURI}/directory`, { params })
    return data.result
  }

  async getProfile (access_token: string|null): Promise<any> {
    const params = { access_token }
    const { data } = await $http.get(`${baseURI}/profile`, { params })
    return data.result
  }
}

const githubService = new Github();

export default githubService