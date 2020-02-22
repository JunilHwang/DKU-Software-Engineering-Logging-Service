import Cookie from 'js-cookie'
import { githubService } from '@/services';
import { ActionContext, Module } from 'vuex';
import {RootState, UserState, ProfileType, AccessToken} from '@/middleware/store/StateType';
import { SIGN_IN } from '../MutationType';

const access_token: AccessToken = Cookie.get('access_token') || null

const state: UserState = {
  access_token,
  profile: {
    login: '',
    avatar_url: ''
  }
}

const mutations = {
  [SIGN_IN]: (state: UserState, profile: ProfileType) => {
    state.profile = profile
  }
}

const actions = {
  [SIGN_IN]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    const profile = await githubService.getProfile(state.access_token)
    commit(SIGN_IN, profile)
  }
}

const UserModule: Module<UserState, RootState> = { state, mutations, actions }

export default UserModule
