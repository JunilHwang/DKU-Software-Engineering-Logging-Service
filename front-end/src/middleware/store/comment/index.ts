import { ActionContext, Module } from 'vuex'
import { CommentState, RootState } from '../types'
import { commentService } from '@/services'
import { FETCH_COMMENT, ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../types'
import { Comment, CommentVO } from '@Domain'


const state: CommentState = {
  commentList: []
}

const mutations = {
  [FETCH_COMMENT]: (state: CommentState, commentList: Comment[]) => {
    state.commentList = commentList
  }
}

const actions = {
  [FETCH_COMMENT]: ({ commit }: ActionContext<CommentState, RootState>, post: number) => {
    commentService.findCommentByPost(post).then((commentList: Comment[]) => {
      commit(FETCH_COMMENT, commentList)
    })
  },
  [ADD_COMMENT]: ({ dispatch }: ActionContext<CommentState, RootState>, params: CommentVO) => {
    commentService.create(params).then(() => dispatch(FETCH_COMMENT, params.post))
  },
  [UPDATE_COMMENT]: ({ dispatch }: ActionContext<CommentState, RootState>, params: CommentVO) => {

  },
  [DELETE_COMMENT]: () => {

  }
}

const CommentStore: Module<CommentState, RootState> = { state, mutations, actions }

export default CommentStore