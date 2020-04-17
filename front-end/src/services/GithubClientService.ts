import $http from 'axios'
import { GithubContent, ContentVO } from 'domain/src'
import { responseProcessor } from '@/helper'
import { store } from '@/middleware'

const githubURL = 'https://api.github.com'

export default Object.freeze({

  async getContent ({ user, repo, path }: ContentVO): Promise<GithubContent> {
    try {
      const token = store.state.user.access_token
      const headers = { Authorization: `token ${token}` }
      return (await $http.get(`${githubURL}/repos/${user}/${repo}/contents/${path}`, { headers })).data
    } catch ({ code, request }) {
      console.error(code, request)
      throw 'GithubClientService.getContent error'
    }
  },

  async getCommitSha ({ user, repo }: ContentVO) {
    const cache: string|null = localStorage.getItem(`${user}/${repo}/sha`)
    if (cache) return cache

    const token = store.state.user.access_token
    const headers = { Authorization: `token ${token}` }

    const { data } = await $http.get(`${githubURL}/repos/${user}/${repo}/commits`, { headers })
    const sha = data[0].sha

    localStorage.setItem(`${user}/${repo}/sha`, sha)
    return sha
  },

  async hookPingTest (repo: string, id: string, token: string): Promise<void> {
    const headers = { Authorization: `token ${token}` }
    const url: string = `${githubURL}/repos/${repo}/hooks/${id}/pings`
    await responseProcessor<void>($http.post(url, null, { headers }))
  }
})