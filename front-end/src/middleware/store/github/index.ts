import { githubService } from '@/services'
import { FETCH_REPO } from '../MutationType';
import { GithubState, RootState } from '../StateType';
import { ActionContext, Module } from 'vuex';
import { GithubRepository } from '../../../../../back-end/src/domain/Github';

const state: GithubState = {
  repositories: [],
}

const mutations = {
  [FETCH_REPO]: (state: GithubState, repositories: Array<GithubRepository>) => {
    state.repositories = repositories
  }
}

const actions = {
  [FETCH_REPO]: ({ commit, rootState }: ActionContext<GithubState, any>) => {
    const { login } = rootState.user.profile
    githubService.getRepo(login).then(repositories => commit(FETCH_REPO, repositories))
  }
}

const GithubModule: Module<GithubState, RootState> = { state, mutations, actions }

export default GithubModule
