import $http from 'axios'
import { Base64 } from 'js-base64'
import {AccessToken, ProfileType, RepositoryType} from "@/middleware/store/StateType";

const baseURI = '/api/github'

interface ContentVO {
  user: string
  repo: string
  path: string
}

const Github = class {
  async getRepo (user: string): Promise<RepositoryType> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    return data.result
  }

   async getContent (params: ContentVO): Promise<any> {
    const { data } = await $http.get(`${baseURI}/content`, { params })
    return data.result
  }

  async getMD (params: ContentVO): Promise<any> {
    const result = await this.getContent(params)
    return Base64.decode(result.content)
  }

  async getProfile (access_token: AccessToken): Promise<ProfileType> {
    const params = { access_token }
    const { data } = await $http.get(`${baseURI}/profile`, { params })
    return data.result
  }
}

const githubService = new Github();

export default githubService
