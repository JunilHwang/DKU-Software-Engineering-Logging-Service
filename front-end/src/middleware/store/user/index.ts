import Cookie from 'js-cookie'
import { userService } from '@/services'
import { Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import { AccessToken } from '../types'
import { GithubProfile, PostView, User } from 'domain/src'

@Module({ namespaced: true })
export default class UserModule extends VuexModule {

  access_token: AccessToken = Cookie.get('access_token') || null
  profile: GithubProfile|null = null
  posts: PostView[] = []
  user: User|null = null

  state!: { posts: PostView[], user: User|null }

  @Mutation SIGN_OUT () {
    this.profile = null
    this.access_token = null
    Cookie.remove('access_token')
  }

  @Mutation INIT (user: User) {
    this.profile = user.profile
  }

  @MutationAction async SIGN_IN (access_token: AccessToken) {
    return { profile: await userService.getMe(access_token) }
  }

  @MutationAction async FETCH_USER_POST (userId: string) {
    this.state.posts = []
    return { posts: await userService.getUserPosts(userId) }
  }

  @MutationAction async FETCH_USER (userId: string) {
    this.state.user = null
    return { user: await userService.getUser(userId) }
  }

}