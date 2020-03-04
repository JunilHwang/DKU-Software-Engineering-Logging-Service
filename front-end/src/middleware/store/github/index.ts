import { githubService } from '@/services'
import { FETCH_GITHUB_REPO, FETCH_GITHUB_CONTENT, GithubState, RootState } from '@/middleware/store/types'
import { ActionContext, Module } from 'vuex'
import { GithubRepository } from '@Domain/Github'

const state: GithubState = {
  repositories: [],
  content: ''
}

const mutations = {
  [FETCH_GITHUB_REPO]: (state: GithubState, repositories: Array<GithubRepository>) => {
    state.repositories = repositories
  },
  [FETCH_GITHUB_CONTENT]: (state: GithubState, content: string) => {
    state.content = content
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
