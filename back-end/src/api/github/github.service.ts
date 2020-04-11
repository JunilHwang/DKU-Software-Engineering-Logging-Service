import { Inject, Injectable } from '@nestjs/common'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain'
import { GithubAdapter } from './github.adapter'

@Injectable()
export class GithubService {

  constructor(@Inject('GithubAdapter') private readonly githubAdapter: GithubAdapter) {}

  public getRepo (user: string): Promise<Array<GithubRepository>> {
    try {
      return this.githubAdapter.getRepo(user)
    } catch (e) {
      console.log('githubService.getRepo', e)
      throw e
    }
  }

  public getContent (params: { [k: string]: string }): Promise<GithubContent> {
    try {
      return this.githubAdapter.getContent(params)
    } catch (e) {
      console.log('githubService.getContent', e)
      throw e
    }
  }

  public getToken (code: string): Promise<GithubResponseToken> {
    try {
      return this.githubAdapter.getToken(code)
    } catch (e) {
      console.log('githubService.getToken', e)
      throw e
    }
  }

  public getProfile (token: string): Promise<GithubProfile> {
    try {
      return this.githubAdapter.getProfile(token)
    } catch (e) {
      console.log('githubService.getProfile', e)
      throw e
    }
  }

  public getTrees (params: { [k: string]: string }): Promise<GithubTrees> {
    try {
      return this.githubAdapter.getTrees(params)
    } catch (e) {
      console.log('githubService.getTrees', e)
      throw e
    }
  }

  public getBlob (params: { [k: string]: string }): Promise<GithubBlob> {
    try {
      return this.githubAdapter.getBlob(params)
    } catch (e) {
      console.log('githubService.getBlob', e)
      throw e
    }
  }

}
