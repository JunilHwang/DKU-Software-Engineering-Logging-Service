import $http from 'axios'
import { Post, PostVO } from '@Domain'

const baseURI = '/api/post'

export default Object.freeze({

  async create (postVO: PostVO): Promise<Post> {
    const { data } = await $http.post(baseURI, postVO)
    return data.result
  },

  async fetch (idx: number): Promise<Post> {
    const { data } = await $http.get(`${baseURI}/${idx}`)
    return data.result
  },

  async fetchAll (): Promise<Post[]> {
    const { data } = await $http.get(baseURI)
    return data.result
  },

})