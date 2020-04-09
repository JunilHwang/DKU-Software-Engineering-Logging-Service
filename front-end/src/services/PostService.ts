import $http from 'axios'
import { Post, PostVO, PostView, GithubContent } from '@Domain'
import { responseProcessor, blobToContent } from '@/helper'
import { githubClientService } from './index'

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
  },

  async refresh (idx: number, route: string): Promise<Post> {
    const [ user, repo, ...path ] = route.split('/')
    const githubContent: GithubContent = await githubClientService.getContent({ user, repo, path: path.join('/') })
    const content = blobToContent(githubContent)
    return await responseProcessor<Post>($http.patch(`${baseURI}/${idx}`, { content }))
  },

  async update (post: Post): Promise<Post> {
    return await responseProcessor<Post>($http.put(`${baseURI}/${post.idx}`, post))
  }
})