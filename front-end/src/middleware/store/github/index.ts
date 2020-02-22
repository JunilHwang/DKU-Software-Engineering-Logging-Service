import { githubService } from '@/services'
import { FETCH_REPO } from '../MutationType';
import { GithubState, RepositoryType, RootState } from '../StateType';
import { ActionContext, Module } from 'vuex';

const state: GithubState = {
  repository: [],
}

const mutations = {
  [FETCH_REPO]: (state: GithubState, repository: RepositoryType) => {
    state.repository = repository
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
