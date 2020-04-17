import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import { commentService } from '@/services'
import { Comment, CommentVO } from 'domain/src'

@Module({
  namespaced: true
})
export default class CommentStore extends VuexModule {

  commentList: Comment[] = []
  selectedComment: Comment|null = null

  @MutationAction
  async FETCH_COMMENT (post: number) {
    return { commentList: await commentService.findCommentByPost(post) }
  }

  @MutationAction
  async FETCH_ONE_COMMENT (idx: number) {
    return { selectedComment: await commentService.findComment(idx) }
  }

  @MutationAction
  async ADD_COMMENT (params: CommentVO) {
    return { commentList: await commentService.create(params) }
  }

  @MutationAction
  async DELETE_COMMENT ({ idx, post }: { idx: number, post: number }) {
    return { commentList: await commentService.remove(idx) }
  }

  @MutationAction
  async UPDATE_COMMENT ({ idx, content }: { idx: number, content: string }) {
    return { commentList: await commentService.update(idx, content) }
  }

}