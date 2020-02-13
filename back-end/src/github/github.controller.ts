import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('/api/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repo/:user')
  async getRepo(@Param() param): Promise<any> {
    const success = true
    const result = await this.githubService.getRepo(param.user)
    console.log(result)
    return { success, result }
  }
}
