import $http from 'axios'
import { Base64 } from 'js-base64'
import { AccessToken } from "@/middleware/store/StateType";
import { GithubRepository, GithubProfile, GithubContent } from '../../../back-end/src/domain/Github';

const baseURI = '/api/github'

export interface ContentVO {
  user: string
  repo: string
  path: string
}

const Github = class {
  async getRepo (user: string): Promise<GithubRepository[]> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    return data.result
  }

   async getContent (params: ContentVO): Promise<GithubContent|GithubContent[]> {
    const { data } = await $http.get(`${baseURI}/content`, { params })
    return data.result
  }

  async getMD (params: ContentVO): Promise<string> {
    const result = (await this.getContent(params)) as GithubContent
    return Base64.decode((result.content!))
  }

  async getProfile (access_token: AccessToken): Promise<GithubProfile> {
    const params = { access_token }
    const { data } = await $http.get(`${baseURI}/profile`, { params })
    return data.result
  }
}

const githubService = new Github();

export default githubService
