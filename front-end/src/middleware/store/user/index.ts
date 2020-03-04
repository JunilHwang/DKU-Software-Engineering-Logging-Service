import Cookie from 'js-cookie'
import { userService } from '@/services';
import { ActionContext, Module } from 'vuex';
import { RootState, UserState, AccessToken } from '@/middleware/store/StateType';
import { SIGN_IN } from '../MutationType';
import { GithubProfile } from '@Domain/Github';

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
  profile: { ...profileInit }
}

const mutations = {
  [SIGN_IN]: (state: UserState, profile: GithubProfile) => {
    state.profile = profile
  }
}

const actions = {
  [SIGN_IN]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    const profile: GithubProfile|null = await userService.getUser(state.access_token)
    if (profile !== null) {
      commit(SIGN_IN, profile)
    }
  }
}

const UserModule: Module<UserState, RootState> = { state, mutations, actions }

export default UserModule
