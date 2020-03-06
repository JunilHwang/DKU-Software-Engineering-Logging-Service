import $http from 'axios'
import { GithubRepository, GithubContent, GithubTrees, GithubBlob, ContentVO } from '@Domain'

const githubURL = 'https://api.github.com'
const baseURI = '/api/github'

export default Object.freeze({

  async getRepo (user: string): Promise<GithubRepository[]> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    return data.result
  },

  async getContent (params: ContentVO): Promise<GithubContent|GithubContent[]> {
    const { data } = await $http.get(`${baseURI}/content`, { params })
    return data.result
  },

  async getCommitSha ({ user, repo }: ContentVO) {
    const cache = localStorage.getItem(`${user}/${repo}/sha`)
    if (cache) return cache

    const { data: commits } = await $http.get(`${githubURL}/repos/${user}/${repo}/commits`)
    const sha = commits[0].sha

    localStorage.setItem(`${user}/${repo}/sha`, sha)
    return sha
  },

  async getTrees (params: ContentVO): Promise<GithubTrees> {
    const { data } = await $http.get(`${baseURI}/trees`, { params })
    return data.result
  },

  async getBlob (params: ContentVO): Promise<GithubBlob> {
    const { data } = await $http.get(`${baseURI}/blob`, { params })
    return data.result
  }

})