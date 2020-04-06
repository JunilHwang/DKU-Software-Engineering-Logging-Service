import $http from 'axios'
import { GithubProfile, GithubRepository, GithubContent, GithubTrees, GithubBlob, ContentVO, GithubHook } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/github'

export default Object.freeze({

  async getRepo ({ login }: GithubProfile): Promise<GithubRepository[]> {
    return (await responseProcessor<GithubRepository[]>($http.get(`${baseURI}/repo/${login}`), 200))!
  },

  async getContent (params: ContentVO): Promise<GithubContent> {
    return (await responseProcessor<GithubContent>($http.get(`${baseURI}/content`, { params }), 200))!
  },

  async getTrees (params: ContentVO): Promise<GithubTrees> {
    return (await responseProcessor<GithubTrees>($http.get(`${baseURI}/trees`, { params }), 200))!
  },

  async getBlob (params: ContentVO): Promise<GithubBlob> {
    return (await responseProcessor<GithubBlob>($http.get(`${baseURI}/blob`, { params }), 200))!
  },

  async getHook (): Promise<GithubHook[]> {
    return (await responseProcessor<GithubHook[]>($http.get(`${baseURI}/hook`), 200))!
  }

})