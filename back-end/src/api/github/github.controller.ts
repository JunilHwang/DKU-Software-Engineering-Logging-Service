import { Controller, Get, Param, Query, Res, CacheTTL, HttpCode, HttpStatus, Post, Body, Req, Delete, Inject, CACHE_MANAGER, CacheStore } from '@nestjs/common'
import { Response, Request } from 'express'
import { GithubFacade } from './github.facade'
import { client_id, redirectURL } from './secret'
import { GithubHookEntity as GithubHook } from '@/entity'
import { GithubHookPayload, GithubTrees, GithubContent, GithubRepository, GithubBlob } from '@/domain'
import { Token } from '@/middle'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}&scope=admin:repo_hook`

@Controller('/api/github')
export class GithubController {
  constructor(
    private readonly githubFacade: GithubFacade,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
  ) {}

  @Get('repo/:user')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public getRepo (@Param('user') user: string): Promise<GithubRepository[]> {
    return this.githubFacade.getRepo(user)
  }

  @Get('content')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public getContent (@Query() { user, repo, path }): Promise<GithubContent>  {
    return this.githubFacade.getContent({ user, repo, path })
  }

  @Get('sign-in')
  public signIn (@Res() res: Response): void {
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(githubAuthURL)
  }

  @Get('authentication')
  public async authentication (@Query('code') code, @Res() res: Response): Promise<void> {

    const token: string = await this.githubFacade.getTokenAndUserCreate(code)

    res.cookie('access_token', token, { maxAge: 1000 * 60 * 60 })
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect('/')

  }

  @Get('trees')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public getTrees (@Query() { user, repo, sha }): Promise<GithubTrees> {
    return this.githubFacade.getTrees({ user, repo, sha })
  }

  @Get('blob')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public getBlob (@Query() { user, repo, sha }): Promise<GithubBlob> {
    return this.githubFacade.getBlob({ user, repo, sha })
  }

  @Get('hook')
  @HttpCode(HttpStatus.OK)
  public getHook (@Token() access_token: string): Promise<GithubHook[]> {
    return this.githubFacade.getHooks({ access_token })
  }

  @Post('hook')
  @HttpCode(HttpStatus.OK)
  public addHook (@Body('repo') repo: string, @Token() access_token: string): Promise<GithubHook[]> {
    return this.githubFacade.addHook({ repo, access_token })
  }

  @Post('hook/commit')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async hookPayload (@Body() payload: GithubHookPayload, @Req() { headers }: Request): Promise<void> {
    if (
      headers['x-github-event'] !== 'push' ||
      payload.ref !== 'refs/heads/master'
    ) return

    const cacheDelete = list => list.forEach(v => this.cacheManager.del(`/api/post/${v}`))

    // 캐시 삭제
    this.cacheManager.del('/api/post')
    this.githubFacade.receiveHook(payload).then(cacheDelete)
  }

  @Delete('hook/:idx')
  @HttpCode(HttpStatus.OK)
  public removeHook (@Param('idx') idx: number, @Token() access_token: string): Promise<GithubHook[]> {
    return this.githubFacade.removeHook(idx, access_token)
  }
}
