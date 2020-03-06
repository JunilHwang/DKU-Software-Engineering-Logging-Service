import { Module, ActionContext } from 'vuex'
import { ADD_POST, FETCH_POST, FETCH_POST_ALL, RootState, PostState } from '../types'
import { PostVO, Post } from "@Domain";
import { postService } from '@/services'

const state: PostState = {
  selectedPost: null,
  postList: []
}

const mutations = {
  [FETCH_POST]: (state: PostState, selectedPost: Post) => {
    state.selectedPost = selectedPost
  },
  [FETCH_POST_ALL]: (state: PostState, postList: Post[]) => {
    state.postList = postList
  },
}

const actions = {
  [ADD_POST]: async ({ commit }: ActionContext<PostState, RootState>, postVO: PostVO): Promise<Post> => {
    return await postService.create(postVO)
  },
  [FETCH_POST]: ({ commit }: ActionContext<PostState, RootState>, idx: number) => {
    postService.fetch(idx).then((selectedPost: Post) => {
      commit(FETCH_POST, selectedPost)
    })
  },
  [FETCH_POST_ALL]: ({ commit }: ActionContext<PostState, RootState>) => {
    postService.fetchAll().then((postList: Post[]) => {
      commit(FETCH_POST_ALL, postList)
    })
  },
}

const PostModule: Module<PostState, RootState> = { state, mutations, actions }

export default PostModule