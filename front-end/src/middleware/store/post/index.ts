import { Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import { FETCH_POST, FETCH_POST_ALL, LIKE_POST, DELETE_POST, REFRESH_POST, UPDATE_POST } from '../types'
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

  @MutationAction
  async [DELETE_POST] (idx: number) {
    return { postList: await postService.remove(idx) }
  }

  @MutationAction
  async [REFRESH_POST] ({ idx, route }: Post) {
    return { selectedPost: await postService.refresh(idx, route) }
  }

  @MutationAction
  async [UPDATE_POST] ({ idx, route }: Post) {
    return { selectedPost: await postService.refresh(idx, route) }
  }

}