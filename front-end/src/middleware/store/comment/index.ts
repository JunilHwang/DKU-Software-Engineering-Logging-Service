import {Module, VuexModule, Action, MutationAction, Mutation} from 'vuex-module-decorators'

import { commentService } from '@/services'
import {FETCH_COMMENT, ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT, FETCH_ONE_COMMENT} from '../types'
import { Comment, CommentVO } from '@Domain'

@Module
export default class CommentStore extends VuexModule {

  commentList: Comment[] = []
  selectedComment: Comment|null = null

  @MutationAction
  async [FETCH_COMMENT] (post: number) {
    return { commentList: await commentService.findCommentByPost(post) }
  }

  @MutationAction
  async [FETCH_ONE_COMMENT] (idx: number) {
    return { selectedComment: await commentService.findComment(idx) }
  }

  @MutationAction
  async [ADD_COMMENT] (params: CommentVO) {
    return { commentList: await commentService.create(params) }
  }

  @MutationAction
  async [DELETE_COMMENT] ({ idx, post }: { idx: number, post: number }) {
    return { commentList: await commentService.remove(idx) }
  }

  @MutationAction
  async [UPDATE_COMMENT] ({ idx, content }: { idx: number, content: string }) {
    return { commentList: await commentService.update(idx, content) }
  }

}