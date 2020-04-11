import { Controller, Get, Param, Query, Res, CacheTTL, HttpCode, HttpStatus, Post, Body, UnauthorizedException, Req, Delete, Inject, CACHE_MANAGER, CacheStore } from '@nestjs/common'
import { Response, Request } from 'express'
import { GithubFacade } from './github.facade'
import { client_id, redirectURL } from './secret'
import { UserEntity as User, GithubHookEntity as GithubHook } from '@/entity'
import { GithubHookPayload } from '@/domain'
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
  public async getRepo (@Param('user') user: string) {
    return await this.githubFacade.getRepo(user)
  }

  @Get('content')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getContent (@Query() { user, repo, path }) {
    return await this.githubFacade.getContent(user, repo, path)
  }

  @Get('sign-in')
  public signIn (@Res() res: Response) {
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(githubAuthURL)
  }

  @Get('authentication')
  public async authentication (@Query('code') code, @Res() res: Response) {

    const { access_token } = await this.githubFacade.getToken(code)

    await this.userService.create(
      await this.githubFacade.getProfile(access_token),
      access_token
    )

    res.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect('/')

  }

  @Get('trees')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getTrees (@Query() { user, repo, sha }) {
    return await this.githubFacade.getTrees(user, repo, sha)
  }

  @Get('blob')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getBlob (@Query() { user, repo, sha }) {
    return await this.githubFacade.getBlob(user, repo, sha)
  }

  @Get('hook')
  @HttpCode(HttpStatus.OK)
  public async getHook (@Req() { cookies: { access_token } }: Request): Promise<GithubHook[]> {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    return await this.githubFacade.getHook(user)
  }

  @Post('hook')
  @HttpCode(HttpStatus.OK)
  public async addHook (@Body('repo') repo: string, @Token() access_token: string): Promise<GithubHook[]> {

    return await this.githubFacade.addHook(
      await this.userService.findByToken(access_token),
      repo,
      access_token
    )

  }

  @Post('hook/commit')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async hookPayload (@Body() { ref, commits, repository: { full_name } }: GithubHookPayload, @Req() { headers }: Request): Promise<void> {
    if (
      headers['x-github-event'] !== 'push' ||
      ref !== 'refs/heads/master'
    ) return

    const reducer = (repo, v) => [ ...repo, ...v.modified]
    const cacheDelete = list => list.forEach(v => this.cacheManager.del(`/api/post/${v}`))
    const routes: string[] = commits.reduce(reducer, []).map(v => `${full_name}/${v}`)

    if (routes.length == 0) return

    // 캐시 삭제
    this.cacheManager.del('/api/post')
    this.githubFacade.receiveHook(routes).then(cacheDelete)
  }

  @Delete('hook/:idx')
  @HttpCode(HttpStatus.OK)
  public async removeHook (@Param('idx') idx: number, @Req() { cookies: { access_token } }: Request): Promise<GithubHook[]> {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    await this.githubFacade.removeHook(idx, access_token)
    return await this.githubFacade.getHook(user)
  }
}
