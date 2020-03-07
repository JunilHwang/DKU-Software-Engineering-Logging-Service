import Cookie from 'js-cookie'
import { userService } from '@/services';
import { ActionContext, Module } from 'vuex';
import { RootState, UserState, AccessToken, SIGN_IN, SIGN_OUT, FETCH_USER_POST } from '../types';
import { GithubProfile, Post } from '@Domain';

const access_token: AccessToken = Cookie.get('access_token') || null
const profileInit: GithubProfile = {
  login: '',
  id: 0,
  node_id: '',
  avatar_url: '',
  gravatar_id: '',
  url: '',
  html_url: '',
  followers_url: '',
  following_url: '',
  gists_url: '',
  starred_url: '',
  subscriptions_url: '',
  organizations_url: '',
  repos_url: '',
  events_url: '',
  received_events_url: '',
  type: '',
  site_admin: false
}

const state: UserState = {
  access_token,
  profile: { ...profileInit },
  posts: []
}

const mutations = {
  [SIGN_IN]: (state: UserState, profile: GithubProfile) => {
    state.profile = profile
  },
  [SIGN_OUT]: (state: UserState) => {
    state.profile = { ...profileInit }
    Cookie.remove('access_token')
  },
  [FETCH_USER_POST]: (state: UserState, posts: Post[]) => {
    state.posts = posts
  },
}

const actions = {
  [SIGN_IN]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    const profile: GithubProfile|null = await userService.getUser(state.access_token)
    if (profile !== null) {
      commit(SIGN_IN, profile)
    }
  },
  [FETCH_USER_POST]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    userService.getUserPosts().then((posts: Post[]) => {
      posts.forEach((v: Post) => {
        v.writer = {
          id: state.profile.login,
          profile: state.profile
        }
      })
      commit(FETCH_USER_POST, posts)
    })
  },
}

const UserModule: Module<UserState, RootState> = { state, mutations, actions }

export default UserModule
