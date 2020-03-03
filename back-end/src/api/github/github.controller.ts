import { Controller, Get, Param, Query, Redirect, Res, Request, CacheTTL } from '@nestjs/common';
import { GithubService } from './github.service';
import { client_id, redirectURL } from './secret'
import { UserService } from '@/api/user/user.service';
import {UserEntity} from "@/api/user/user.entity";

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURL}`

const context = {}

@Controller('/api/github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly userService: UserService
  ) {}

  @Get('repo/:user')
  @CacheTTL(60 * 60)
  async getRepo (@Param('user') user: string, @Request() { cookies } ): Promise<any> {

    const send = {
      success: false,
      result: null
    }

    const result = await this.githubService.getRepo(user, cookies.access_token)
    if (result !== null) {
      send.success = true
      send.result = result
    }
    return send;
  }

  @Get('content')
  @CacheTTL(60 * 60)
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
  @CacheTTL(0)
  @Redirect(githubAuthURL)
  signIn () {
    return { success: true }
  }

  @Get('authentication')
  @CacheTTL(0)
  async authentication (@Query('code') code, @Res() response) {
    const send = {
      success: false,
      result: null
    }
    const tokenResult = await this.githubService.getToken(code)
    if (tokenResult === null) return send

    const { access_token } = tokenResult

    const profileResult = await this.githubService.getProfile(access_token);
    if (profileResult === null) return send

    const user: UserEntity = await this.userService.create(profileResult, access_token)
    if (!user) return send

    response.cookie('access_token', access_token, { maxAge: 1000 * 60 * 60 })
    response.redirect('/')
  }
}
