import {Module, VuexModule, Action, MutationAction, Mutation} from 'vuex-module-decorators'

import { commentService } from '@/services'
import { FETCH_COMMENT, ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../types'
import { Comment, CommentVO } from '@Domain'

@Module
export default class CommentStore extends VuexModule {

  commentList: Comment[] = []

  @MutationAction
  async [FETCH_COMMENT] (post: number) {
    return { commentList: await commentService.findCommentByPost(post) }
  }

  @MutationAction
  async [ADD_COMMENT] (params: CommentVO) {
    return { commentList: await commentService.create(params) }
  }

  @MutationAction
  async [DELETE_COMMENT] ({ idx, post }: { idx: number, post: number }) {
    return { commentList: await commentService.remove(idx) }

  }

  @Action
  [UPDATE_COMMENT] () { }

}