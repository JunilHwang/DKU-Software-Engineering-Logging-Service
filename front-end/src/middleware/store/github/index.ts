// import { githubService } from '@/services'
import { FETCH_REPO } from '../MutationType';
import { GithubState, RootState } from '../StateType';
import { ActionContext, Module } from 'vuex';

const state: GithubState = {
  repository: [],
}
const mutations = { }
const actions = {
  [FETCH_REPO]: ({ commit, rootState }: ActionContext<GithubState, any>) => {
    const { profile } = rootState.user
    console.log(profile)
  }
}

const GithubModule: Module<GithubState, RootState> = { state, mutations, actions }

export default GithubModule