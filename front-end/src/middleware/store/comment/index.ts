import {Module, VuexModule, Action, MutationAction, Mutation} from 'vuex-module-decorators'

import { commentService } from '@/services'
import { FETCH_COMMENT, ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../types'
import { Comment, CommentVO } from '@Domain'

@Module
export default class CommentStore extends VuexModule {

  commentList: Comment[] = []

  @Mutation
  delete (idx: number) {
    const list: Comment[] = this.commentList
    this.commentList = list.filter((v: Comment) => v.idx !== idx)
  }

  @MutationAction
  async [FETCH_COMMENT] (post: number) {
    return { commentList: await commentService.findCommentByPost(post) }
  }

  @Action
  async [ADD_COMMENT] (params: CommentVO) {
    await commentService.create(params)
    await this.context.dispatch(FETCH_COMMENT, params.post)
  }

  @Action
  [UPDATE_COMMENT] () { }

  @Action({ commit: 'delete' })
  async [DELETE_COMMENT] ({ idx, post }: { idx: number, post: number }) {
    await commentService.remove(idx)
    return idx
  }

}