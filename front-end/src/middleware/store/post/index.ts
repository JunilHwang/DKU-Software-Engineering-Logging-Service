import {Action, Module, MutationAction, VuexModule} from 'vuex-module-decorators'
import { Post, PostView, PostVO } from '@Domain'
import { postService } from '@/services'

@Module({ namespaced: true })
export default class PostModule extends VuexModule {

  selectedPost: Post|null = null
  postList: PostView[] = []
  state!: { selectedPost: Post[]|null }

  @MutationAction
  async FETCH_POST (idx: number) {
    this.state.selectedPost = null
    return { selectedPost: await postService.fetch(idx) }
  }

  @MutationAction
  async FETCH_POST_ALL () {
    return { postList: await postService.fetchAll() }
  }

  @Action
  async ADD_POST (postVO: PostVO) {
    await postService.create(postVO)
  }

  @MutationAction
  async LIKE_POST (idx: number) {
    return { selectedPost: await postService.like(idx) }
  }

  @MutationAction
  async DELETE_POST (idx: number) {
    return { postList: await postService.remove(idx) }
  }

  @MutationAction
  async REFRESH_POST ({ idx, route }: Post) {
    return { selectedPost: await postService.refresh(idx, route) }
  }

  @MutationAction
  async UPDATE_POST ([post, uploaded]: [ Post, string ]) {
    return { selectedPost: await postService.update(post, uploaded) }
  }

}