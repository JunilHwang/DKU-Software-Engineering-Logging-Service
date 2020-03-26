import { Module, VuexModule,  MutationAction } from 'vuex-module-decorators'
import { FETCH_GITHUB_REPO } from '../types'
import { githubService } from '@/services'
import { GithubRepository } from '@Domain'

@Module
export default class GithubModule extends VuexModule {

  repositories: GithubRepository[] = []

  @MutationAction
  async [FETCH_GITHUB_REPO] () {
    const { login } = this.context.rootState.user.profile
    return { repositories: await githubService.getRepo(login) }
  }

}