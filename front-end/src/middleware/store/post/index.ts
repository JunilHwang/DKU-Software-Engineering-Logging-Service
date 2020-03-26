import { Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import { FETCH_POST, FETCH_POST_ALL } from '../types'
import { Post } from '@Domain'
import { postService } from '@/services'

@Module
export default class PostModule extends VuexModule {

  selectedPost: Post|null = null
  postList: Post[] = []

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