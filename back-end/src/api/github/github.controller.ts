import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Response,
  Request,
  CacheTTL,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { GithubService } from './github.service'
import { client_id, redirectURL } from './secret'
import { UserService } from '@/api/user/user.service'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}`

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
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  public signIn (@Response() res) {
    res.redirect(githubAuthURL)
  }

  @Get('authentication')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  public async authentication (@Query('code') code, @Response() response) {

    const { access_token } = await this.githubService.getToken(code)

    await this.userService.create(
      await this.githubService.getProfile(access_token),
      access_token
    )

    response.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    response.redirect('/')

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
}
