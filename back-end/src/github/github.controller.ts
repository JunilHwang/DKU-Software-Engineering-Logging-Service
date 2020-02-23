import { Controller, Get, Param, Query, Redirect, Res } from '@nestjs/common';
import { GithubService } from './github.service';
import { client_id, redirectURL } from './secret'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}`

const context = {}

@Controller('/api/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repo/:user')
  async getRepo (@Param('user') user: string): Promise<any> {
    const send = {
      success: false,
      result: null
    }
    const result = await this.githubService.getRepo(user)
    if (result !== null) {
      send.success = true
      send.result = result
    }
    return send;
  }

  @Get('content')
  async getContent (@Query() { user, repo, path }): Promise<any> {
    const send = {
      success: false,
      result: null
    }
    const result = await this.githubService.getContent(user, repo, path)
    if (result !== null) {
      send.success = true
      send.result = result
    }
    return send;
  }

  @Get('sign-in')
  @Redirect(githubAuthURL)
  signIn () {
    return { success: true }
  }

  @Get('authentication')
  async authentication (@Query('code') code, @Res() response) {
    const send = {
      success: false,
      result: null
    }
    let result = await this.githubService.getToken(code)
    if (result === null) return send

    const { access_token } = result

    result = await this.githubService.getProfile(access_token);
    if (result === null) return send

    context[access_token] = result

    response.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    response.redirect('/')
  }

  @Get('profile')
  getProfile (@Query('access_token') access_token) {
    return {
      success: true,
      result: context[access_token]
    }
  }
}
