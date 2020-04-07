import { Controller, Get, Param, Query, Res, CacheTTL, HttpCode, HttpStatus, Post, Body, UnauthorizedException, Req, Delete, Inject, CACHE_MANAGER, CacheStore } from '@nestjs/common'
import { Response, Request } from 'express'
import { GithubService } from './github.service'
import { client_id, redirectURL } from './secret'
import { UserService } from '@/api/user/user.service'
import { UserEntity as User, GithubHookEntity as GithubHook } from '@/entity'
import { GithubHookPayload } from '@/domain'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}&scope=admin:repo_hook`

@Controller('/api/github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
  ) {}

  @Get('repo/:user')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getRepo (@Param('user') user: string, @Req() { cookies: { access_token }}: Request) {
    return await this.githubService.getRepo(user, access_token)
  }

  @Get('content')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getContent (@Query() { user, repo, path }) {
    return await this.githubService.getContent(user, repo, path)
  }

  @Get('sign-in')
  public signIn (@Res() res: Response) {
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(githubAuthURL)
  }

  @Get('authentication')
  public async authentication (@Query('code') code, @Res() res: Response) {

    const { access_token } = await this.githubService.getToken(code)

    await this.userService.create(
      await this.githubService.getProfile(access_token),
      access_token
    )

    res.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect('/')

  }

  @Get('trees')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getTrees (@Query() { user, repo, sha }) {
    return await this.githubService.getTrees(user, repo, sha)
  }

  @Get('blob')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getBlob (@Query() { user, repo, sha }) {
    return await this.githubService.getBlob(user, repo, sha)
  }

  @Get('hook')
  @HttpCode(HttpStatus.OK)
  public async getHook (@Req() { cookies: { access_token } }: Request): Promise<GithubHook[]> {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    return await this.githubService.getHook(user)
  }

  @Post('hook')
  @HttpCode(HttpStatus.OK)
  public async addHook (@Body('repo') repo: string, @Req() { cookies: { access_token } }): Promise<GithubHook[]> {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    await this.githubService.addHook(user, repo, access_token)
    return await this.githubService.getHook(user)

  }

  @Post('hook/commit')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async hookPayload (@Body() { ref, commits, repository: { full_name } }: GithubHookPayload, @Req() req: Request): Promise<void> {
    if (
      req.headers['x-github-event'] !== 'push' ||
      ref !== 'refs/heads/master'
    ) return


    const reducer = (repo, v) => [ ...repo, ...v.modified]
    const cacheDelete = list => list.forEach(v => this.cacheManager.del(`/api/post/${v}`))
    const paths: string[] = commits.reduce(reducer, []).map(v => `${full_name}/${v}`)

    // 캐시 삭제
    this.cacheManager.del('/api/post')
    this.githubService.receiveHook(paths).then(cacheDelete)
  }

  @Delete('hook/:idx')
  @HttpCode(HttpStatus.OK)
  public async removeHook (@Param('idx') idx: number, @Req() { cookies: { access_token } }: Request): Promise<GithubHook[]> {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    await this.githubService.removeHook(idx, access_token)
    return await this.githubService.getHook(user)
  }
}
