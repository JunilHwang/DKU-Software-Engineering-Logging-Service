import Cookie from 'js-cookie'
import { githubService } from '@/services';
import { ActionContext } from 'vuex';
import { RootState, UserState } from '@/middleware/store/types';
import { SIGN_IN } from '../mutations-type';

const access_token = Cookie.get('access_token') || null

const state: UserState = {
  access_token,
  profile: {}
}

const mutations = {
  [SIGN_IN]: (state: UserState, profile: Object) => {
    state.profile = profile
  }
}

const actions = {
  [SIGN_IN]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    const profile: Object = await githubService.getProfile(state.access_token)
    commit(SIGN_IN, profile)
  }
}

export default {
  state,
  mutations,
  actions,
}