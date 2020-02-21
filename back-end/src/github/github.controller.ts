import {Controller, Get, Next, Param, Query, Redirect} from '@nestjs/common';
import { GithubService } from './github.service';
import { clientId, redirectURL } from './secret'

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURL}`

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
  async authentication (@Query() { code }, @Next() next) {
    const send = {
      success: false,
      result: null
    }
    let result = await this.githubService.getToken(code)
    if (result === null) return send

    const { access_token } = result
    result = await this.githubService.getProfile(access_token);

    if (result === null) return send

    send.success = true
    send.result = result
    return send
  }
}
