import $http from 'axios'
import { GithubContent, ContentVO, Response } from '@Domain'

const githubURL = 'https://api.github.com'

export default Object.freeze({

  async getContent ({ user, repo, path }: ContentVO): Promise<GithubContent> {
    try {
      const { data: content } = await $http.get(`${githubURL}/repos/${user}/${repo}/contents/${path}`)
      return content
    } catch ({ code, request }) {
      console.error(code, request)
      throw 'GithubClientService.getContent error'
    }
  },

  async getCommitSha ({ user, repo }: ContentVO) {
    const cache = localStorage.getItem(`${user}/${repo}/sha`)
    if (cache) return cache

    const { data: commits } = await $http.get(`${githubURL}/repos/${user}/${repo}/commits`)
    const sha = commits[0].sha

    localStorage.setItem(`${user}/${repo}/sha`, sha)
    return sha
  },

})