import { Inject, Injectable } from '@nestjs/common'
import { GithubHookData } from 'domain/src'
import { InjectRepository } from '@nestjs/typeorm'
import { GithubHookEntity as GithubHook, UserEntity as User } from '@/entity'
import { Repository } from 'typeorm'
import { GithubAdapter } from './github.adapter'

@Injectable()
export class GithubHookService {

  constructor(
    @InjectRepository(GithubHook) private readonly githubHookRepository: Repository<GithubHook>,
    @Inject('GithubAdapter') private readonly githubAdapter: GithubAdapter
  ) {}

  public getHooks (params: { user?: User; repo?: string }): Promise<GithubHook[]> {
    try {
      return this.githubHookRepository.find(params)
    } catch (e) {
      console.log('githubHookService.getHooks', e)
      throw e
    }
  }

  public getHook (params: { idx?: number }): Promise<GithubHook|undefined> {
    try {
      return this.githubHookRepository.findOne(params)
    } catch (e) {
      console.log('githubHookService.getHook', e)
      throw e
    }
  }

  public postHook (params: { [k: string]: string }): Promise<GithubHookData> {
    try {
      return this.githubAdapter.postHook(params)
    } catch (e) {
      console.log('githubHookService.postHook', e)
      throw e
    }
  }

  public saveHook (hook: GithubHook): Promise<GithubHook> {
    try {
      return this.githubHookRepository.save(hook)
    } catch (e) {
      console.log('githubHookService.saveHook', e)
      throw e
    }
  }

  public async removeHook (params: { [k: string]: string }): Promise<void> {
    try {
      await this.githubAdapter.removeHook(params)
      await this.githubHookRepository.delete({ repo: params.repo })
    } catch (e) {
      console.log('githubHookService.removeHook', e)
      throw e
    }
  }

}
