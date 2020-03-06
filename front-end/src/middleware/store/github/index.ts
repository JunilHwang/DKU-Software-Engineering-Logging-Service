import { githubService } from '@/services'
import { FETCH_GITHUB_REPO, FETCH_GITHUB_CONTENT, GithubState, RootState } from '../types'
import { ActionContext, Module } from 'vuex'
import { GithubRepository } from '@Domain'

interface ContentPayload {
  content: string
  route: string
}

const state: GithubState = {
  repositories: [],
  content: '',
  route: '',
}

const mutations = {
  [FETCH_GITHUB_REPO]: (state: GithubState, repositories: Array<GithubRepository>) => {
    state.repositories = repositories
  },
  [FETCH_GITHUB_CONTENT]: (state: GithubState, { content, route }: ContentPayload) => {
    Object.assign(state, { content, route })
  }
}

const actions = {
  [FETCH_GITHUB_REPO]: ({ commit, rootState }: ActionContext<GithubState, any>) => {
    const { login } = rootState.user.profile
    githubService.getRepo(login).then(repositories => commit(FETCH_GITHUB_REPO, repositories))
  }
}

const GithubModule: Module<GithubState, RootState> = { state, mutations, actions }

export default GithubModule
