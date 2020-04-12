import { Inject, Injectable } from '@nestjs/common'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain'
import { GithubAdapter } from './github.adapter'

@Injectable()
export class GithubService {

  constructor(@Inject('GithubAdapter') private readonly githubAdapter: GithubAdapter) {}

  public async getRepo (user: string): Promise<Array<GithubRepository>> {
    try {
      return await this.githubAdapter.getRepo(user)
    } catch (e) {
      console.log('githubService.getRepo', e)
      throw e
    }
  }

  public async getContent (params: { [k: string]: string }): Promise<GithubContent> {
    try {
      return await this.githubAdapter.getContent(params)
    } catch (e) {
      console.log('githubService.getContent', e)
      throw e
    }
  }

  public async getToken (code: string): Promise<GithubResponseToken> {
    try {
      return await this.githubAdapter.getToken(code)
    } catch (e) {
      console.log('githubService.getToken', e)
      throw e
    }
  }

  public async getProfile (token: string): Promise<GithubProfile> {
    try {
      return await this.githubAdapter.getProfile(token)
    } catch (e) {
      console.log('githubService.getProfile', e)
      throw e
    }
  }

  public async getTrees (params: { [k: string]: string }): Promise<GithubTrees> {
    try {
      return await this.githubAdapter.getTrees(params)
    } catch (e) {
      console.log('githubService.getTrees', e)
      throw e
    }
  }

  public async getBlob (params: { [k: string]: string }): Promise<GithubBlob> {
    try {
      return await this.githubAdapter.getBlob(params)
    } catch (e) {
      console.log('githubService.getBlob', e)
      throw e
    }
  }

}
