import $http from 'axios'
import { Base64 } from 'js-base64'
import { GithubRepository, GithubContent } from '@Domain/Github'

const baseURI = '/api/github'

export interface ContentVO {
  user: string
  repo: string
  path: string
}

const GithubService = class {
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
}

const githubService = new GithubService();

export default githubService
