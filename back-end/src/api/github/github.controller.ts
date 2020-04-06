import { Controller, Get, Param, Query, Res, Request, CacheTTL, HttpCode, HttpStatus, Post, Body, UnauthorizedException } from '@nestjs/common'
import { Response } from 'express'
import { GithubService } from './github.service'
import { client_id, redirectURL } from './secret'
import { UserService } from '@/api/user/user.service'
import { UserEntity as User } from '@/entity'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}&scope=admin:repo_hook`

@Controller('/api/github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly userService: UserService
  ) {}

  @Get('repo/:user')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getRepo (@Param('user') user: string, @Request() { cookies: { access_token } } ) {
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

  @Post('hook')
  @HttpCode(HttpStatus.OK)
  public async addHook (@Body() { repo }, @Request() { cookies: { access_token } }) {

    // 현재 로그인 중인 유저 정보 가져오기
    const user: User|undefined = await this.userService.find({ access_token })
    // const user: User|undefined = await this.userService.find({ idx: 1 }) // Test용
    if (user === undefined) throw new UnauthorizedException()

    return await this.githubService.addHook(user, repo, access_token)

  }

  @Post('hook/commit')
  @HttpCode(HttpStatus.OK)
  public getHookCommit (@Body() payload) {
    console.log(payload)
    return 'hook'
  }
}
