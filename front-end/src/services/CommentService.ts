import $http from 'axios'
import { Comment, CommentVO } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/comment'

export default Object.freeze({

  async findCommentByPost (postIdx: number): Promise<Comment[]> {
    return (await responseProcessor<Comment[]>($http.get(`${baseURI}s/${postIdx}`), 200))!
  },

  async findComment (idx: number): Promise<Comment> {
    return (await responseProcessor<Comment>($http.get(`${baseURI}/${idx}`), 200))!
  },

  async create (params: CommentVO): Promise<Comment[]> {
    return (await responseProcessor<Comment[]>($http.post(baseURI, params), 200))!
  },

  async update (idx: number, content: string): Promise<Comment[]> {
    return (await responseProcessor<Comment[]>($http.put(`${baseURI}/${idx}`, { content }), 200))!
  },

  async remove (idx: number): Promise<Comment[]> {
    return (await responseProcessor<Comment[]>($http.delete(`${baseURI}/${idx}`), 200))!
  }
})