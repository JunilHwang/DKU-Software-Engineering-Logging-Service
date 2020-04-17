import $http from 'axios'
import { GithubProfile, GithubRepository, GithubContent, GithubTrees, GithubBlob, ContentVO, GithubHook } from 'domain/src'
import { responseProcessor } from '@/helper'

const baseURI = '/api/github'

export default Object.freeze({

  async getRepo ({ login }: GithubProfile): Promise<GithubRepository[]> {
    return await responseProcessor<GithubRepository[]>($http.get(`${baseURI}/repo/${login}`))
  },

  async getContent (params: ContentVO): Promise<GithubContent> {
    return await responseProcessor<GithubContent>($http.get(`${baseURI}/content`, { params }))
  },

  async getTrees (params: ContentVO): Promise<GithubTrees> {
    return await responseProcessor<GithubTrees>($http.get(`${baseURI}/trees`, { params }))
  },

  async getBlob (params: ContentVO): Promise<GithubBlob> {
    return await responseProcessor<GithubBlob>($http.get(`${baseURI}/blob`, { params }))
  },

  async getHook (): Promise<GithubHook[]> {
    return await responseProcessor<GithubHook[]>($http.get(`${baseURI}/hook`))
  },

  async addHook (repo: string): Promise<GithubHook[]> {
    return await responseProcessor<GithubHook[]>($http.post(`${baseURI}/hook`, { repo }))
  },

  async removeHook (idx: number): Promise<GithubHook[]> {
    return await responseProcessor<GithubHook[]>($http.delete(`${baseURI}/hook/${idx}`))
  }

})