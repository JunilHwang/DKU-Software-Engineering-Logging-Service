import { Module, Action, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import { ADD_POST, FETCH_POST, FETCH_POST_ALL, RootState, PostState } from '../types'
import { PostVO, Post } from "@Domain";
import { postService } from '@/services'

@Module
export default class PostModule extends VuexModule {

  selectedPost: Post|null = null
  postList: Post[] = []

  @Action
  async [ADD_POST] (postVO: PostVO): Promise<true|undefined> {
    return await postService.create(postVO)
  }

  @MutationAction
  async [FETCH_POST] (idx: number) {
    this.selectedPost = null
    return { selectedPost: await postService.fetch(idx) }
  }

  @MutationAction
  async [FETCH_POST_ALL] () {
    return { postList: await postService.fetchAll() }
  }

}