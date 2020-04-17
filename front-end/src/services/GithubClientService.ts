import $http from 'axios'
import { GithubContent, ContentVO } from 'domain/src'
import { responseProcessor, eventBus } from '@/helper'
import Cookie from 'js-cookie'
// import { store } from '@/main'

const githubURL = 'https://api.github.com'

export default Object.freeze({

  async getContent ({ user, repo, path }: ContentVO): Promise<GithubContent> {
    try {
      const token = Cookie.get('access_token')
      const headers = { Authorization: `token ${token}` }
      return (await $http.get(`${githubURL}/repos/${user}/${repo}/contents/${path}`, { headers })).data
    } catch (e) {
      console.error('GithubClientService.getContent error')
      const { status } = e.response
      const message: { [k: number]: string } = {
        401: '로그인이 필요합니다.',
        403: '권한이 없습니다.',
      }
      eventBus.$message({ type: 'error', message: message[status] || '오류로 인하여 취소되었습니다.' })
      throw status
    }
  },

  async getCommitSha ({ user, repo }: ContentVO) {
    const cache: string|null = localStorage.getItem(`${user}/${repo}/sha`)
    if (cache) return cache

    const token = Cookie.get('access_token')
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