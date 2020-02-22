import { githubService } from '@/services'
import { FETCH_REPO } from '../MutationType';
import { GithubState, RootState } from '../StateType';
import { ActionContext, Module } from 'vuex';

const state: GithubState = {
  repository: [],
}

const mutations = {
  [FETCH_REPO]: (state: GithubState, repository: Array<Object>) => {
    state.repository = repository
    console.log(repository)
  }
}

const actions = {
  [FETCH_REPO]: ({ commit, rootState }: ActionContext<GithubState, any>) => {
    const { login } = rootState.user.profile
    githubService.getRepo(login).then(repository => commit(FETCH_REPO, repository))
  }
}

const GithubModule: Module<GithubState, RootState> = { state, mutations, actions }

export default GithubModule