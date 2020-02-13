import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('/api/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repo/:user')
  async getRepo(@Param() param): Promise<any> {
    const send = {
      success: false,
      result: null
    }
    const result = await this.githubService.getRepo(param.user)
    if (result !== null) {
      send.success = true
      send.result = result
    }
    return send;
  }
}
