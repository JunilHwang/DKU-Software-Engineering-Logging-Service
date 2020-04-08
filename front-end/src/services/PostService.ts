import $http from 'axios'
import { Post, PostVO, PostView } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/post'

export default Object.freeze({

  async create (postVO: PostVO): Promise<true|undefined> {
    return await responseProcessor<true>($http.post(baseURI, postVO))
  },

  async fetch (idx: number): Promise<Post> {
    return await responseProcessor<Post>($http.get(`${baseURI}/${idx}`))
  },

  async fetchAll (): Promise<PostView[]> {
    return await responseProcessor<PostView[]>($http.get(baseURI))
  },

  async like (idx: number): Promise<Post> {
    return await responseProcessor<Post>($http.post(`${baseURI}/like/${idx}`))
  },

  async remove (idx: number): Promise<PostView[]> {
    return await responseProcessor<PostView[]>($http.delete(`${baseURI}/${idx}`))
  }
})