import { Controller, Get, Param, Query, Redirect, Response, Request, CacheTTL } from '@nestjs/common'
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
  @CacheTTL(60 * 60)
  async getRepo (@Param('user') user: string, @Request() { cookies } ) {
    return {
      success: true,
      result: await this.githubService.getRepo(user, cookies.access_token)
    }
  }

  @Get('content')
  @CacheTTL(60 * 60)
  async getContent (@Query() { user, repo, path }) {
    return {
      success: true,
      result: await this.githubService.getContent(user, repo, path)
    }
  }

  @Get('sign-in')
  signIn (@Response() res) {
    res.redirect(githubAuthURL)
  }

  @Get('authentication')
  async authentication (@Query('code') code, @Response() response) {
    const { access_token } = await this.githubService.getToken(code)
    await this.userService.create(
      await this.githubService.getProfile(access_token),
      access_token
    )

    response.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    response.redirect('/')
  }

  @Get('trees')
  @CacheTTL(60 * 60)
  async getTrees (@Query() { user, repo, sha }) {
    return {
      success: true,
      result: await this.githubService.getTrees(user, repo, sha)
    }
  }

  @Get('blob')
  @CacheTTL(60 * 60)
  async getBlob (@Query() { user, repo, sha }) {
    return {
      success: true,
      result: await this.githubService.getBlob(user, repo, sha)
    }
  }
}
