import Cookie from 'js-cookie'
import { userService } from '@/services';
import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import { AccessToken, SIGN_IN, SIGN_OUT, FETCH_USER_POST, FETCH_USER } from '../types';
import { GithubProfile, Post, User } from '@Domain';

@Module
export default class UserModule extends VuexModule {

  access_token: AccessToken = Cookie.get('access_token') || null
  profile: GithubProfile|null = null
  posts: Post[] = []
  user: User|null = null

  // @Mutation signIn (profile: GithubProfile) {
  //   this.profile = profile
  // }

  @Mutation [SIGN_OUT] () {
    this.profile = null
    Cookie.remove('access_token')
  }

  @MutationAction async [SIGN_IN] (access_token: AccessToken) {
    return { profile: await userService.getMe(access_token) }
  }

  @MutationAction async [FETCH_USER_POST] (userId: string) {
    this.posts = []
    return { posts: await userService.getUserPosts(userId) }
  }

  @MutationAction async [FETCH_USER] (userId: string) {
    this.user = null
    return { user: await userService.getUser(userId) }
  }

}