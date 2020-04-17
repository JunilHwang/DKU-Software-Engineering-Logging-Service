import $http from 'axios'
import { Comment, CommentVO } from 'domain/src'
import { responseProcessor } from '@/helper'

const baseURI = '/api/comment'

export default Object.freeze({

  async findCommentByPost (postIdx: number): Promise<Comment[]> {
    return await responseProcessor<Comment[]>($http.get(`${baseURI}s/${postIdx}`))
  },

  async findComment (idx: number): Promise<Comment> {
    return await responseProcessor<Comment>($http.get(`${baseURI}/${idx}`))
  },

  async create (params: CommentVO): Promise<Comment[]> {
    return await responseProcessor<Comment[]>($http.post(baseURI, params))
  },

  async update (idx: number, content: string): Promise<Comment[]> {
    return await responseProcessor<Comment[]>($http.put(`${baseURI}/${idx}`, { content }))
  },

  async remove (idx: number): Promise<Comment[]> {
    return await responseProcessor<Comment[]>($http.delete(`${baseURI}/${idx}`))
  }
})