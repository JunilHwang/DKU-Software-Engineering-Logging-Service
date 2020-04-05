import { Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import { FETCH_POST, FETCH_POST_ALL, LIKE_POST } from '../types'
import { Post, PostView } from '@Domain'
import { postService } from '@/services'

@Module
export default class PostModule extends VuexModule {

  selectedPost: Post|null = null
  postList: PostView[] = []
  state!: { selectedPost: Post[]|null }

  @MutationAction
  async [FETCH_POST] (idx: number) {
    this.state.selectedPost = null
    return { selectedPost: await postService.fetch(idx) }
  }

  @MutationAction
  async [FETCH_POST_ALL] () {
    return { postList: await postService.fetchAll() }
  }

  @MutationAction
  async [LIKE_POST] (idx: number) {
    return { selectedPost: await postService.like(idx) }
  }

}