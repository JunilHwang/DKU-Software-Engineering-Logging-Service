import $http from 'axios'
import { GithubRepository, GithubContent, GithubTrees, GithubBlob } from '@Domain/Github'

const githubURL = 'https://api.github.com'
const baseURI = '/api/github'

export interface ContentVO {
  user: string
  repo: string
  path?: string
  sha?: string
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

  async getCommitSha ({ user, repo }: ContentVO) {
    const { data } = await $http.get(`${githubURL}/repos/${user}/${repo}/commits`)
    return data.result[0].sha
  }

  async getTrees (params: ContentVO): Promise<GithubTrees> {
    const { data } = await $http.get(`${baseURI}/trees`, { params })
    return data.result
  }

  async getBlob (params: ContentVO): Promise<GithubBlob> {
    const { data } = await $http.get(`${baseURI}/blob`, { params })
    return data.result
  }
}

const githubService = new GithubService();

export default githubService
