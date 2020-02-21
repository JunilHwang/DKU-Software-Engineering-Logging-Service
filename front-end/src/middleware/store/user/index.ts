import Cookie from 'js-cookie'
import { githubService } from '@/services';
import { ActionContext } from 'vuex';
import { RootState, UserState } from '@/middleware/store/types';
import { SIGN_IN } from '../mutations-type';

const access_token = Cookie.get('access_token') || null

const state: UserState = {
  access_token
}

const mutations = { }

const actions = {
  [SIGN_IN]: async ({ commit, state }: ActionContext<UserState, RootState>) => {
    const result = await githubService.getProfile(state.access_token)
    console.log(result)
  }
}

export default {
  state,
  mutations,
  actions,
}