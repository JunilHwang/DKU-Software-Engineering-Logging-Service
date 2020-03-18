import $http from 'axios'
import { Post, PostVO } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/post'

export default Object.freeze({

  async create (postVO: PostVO): Promise<true|undefined> {
    return await responseProcessor<true>($http.post(baseURI, postVO), 201)
  },

  async fetch (idx: number): Promise<Post> {
    return (await responseProcessor<Post>($http.get(`${baseURI}/${idx}`), 200))!
  },

  async fetchAll (): Promise<Post[]> {
    return (await responseProcessor<Post[]>($http.get(baseURI), 200))!
  },

})