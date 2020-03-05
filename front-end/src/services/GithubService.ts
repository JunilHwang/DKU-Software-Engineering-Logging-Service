import $http from 'axios'
import { Base64 } from 'js-base64'
import { GithubRepository, GithubContent } from '@Domain/Github'

const githubURL = 'https://api.github.com'
const baseURI = '/api/github'

export interface ContentVO {
  user: string
  repo: string
  path?: string
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

  async getTree ({ user, repo }: ContentVO): Promise<GithubContent|GithubContent[]> {
    const { data: commits } = await $http.get(`${githubURL}/repos/${user}/${repo}/commits`)
    const [ sha ] = commits
    const params = { user, repo, sha }
    const { data } = await $http.get(`${baseURI}/tree`, { params })
    return data.result
  }
}

const githubService = new GithubService();

export default githubService
