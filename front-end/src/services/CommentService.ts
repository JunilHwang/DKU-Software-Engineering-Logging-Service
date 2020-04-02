import $http from 'axios'
import { Comment, CommentVO } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/comment'

export default Object.freeze({

  async findCommentByPost (postIdx: number): Promise<Comment[]> {
    return (await responseProcessor<Comment[]>($http.get(`${baseURI}s/${postIdx}`), 200))!
  },

  async create (params: CommentVO): Promise<void> {
    return (await responseProcessor<void>($http.post(baseURI, params), 201))!
  },

  async remove (idx: number): Promise<void> {
    return (await responseProcessor<void>($http.delete(`${baseURI}/${idx}`), 204))!
  }
})