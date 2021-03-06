import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import { githubService } from '@/services'
import { GithubRepository, GithubProfile, GithubHook } from 'domain/src'

@Module({
  namespaced: true
})
export default class GithubModule extends VuexModule {

  repositories: GithubRepository[] = []
  hookList: GithubHook[] = []

  @MutationAction async FETCH_GITHUB_REPO (profile: GithubProfile) {
    return { repositories: await githubService.getRepo(profile) }
  }

  @MutationAction async FETCH_GITHUB_HOOK () {
    return { hookList: await githubService.getHook() }
  }

  @MutationAction async ADD_GITHUB_HOOK (repo: string) {
    return { hookList: await githubService.addHook(repo) }
  }

  @MutationAction async DELETE_GITHUB_HOOK (idx: number) {
    return { hookList: await githubService.removeHook(idx) }
  }

}