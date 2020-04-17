import { CacheTTL, Controller, Get, Query, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { UserEntity as User, PostViewEntity as PostView } from '@/entity'
import { Token } from '@/middle'
import { UserFacade } from './user.facade'
import { GithubProfile } from 'domain/src'

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userFacade: UserFacade,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getProfile (@Query('access_token') access_token): Promise<GithubProfile> {
    return await this.userFacade.findProfile(access_token)
  }

  @Get('/posts')
  @HttpCode(HttpStatus.OK)
  public async getMyPosts (@Token() access_token: string): Promise<PostView[]> {
    return await this.userFacade.findAllByUser({ access_token })
  }

  @Get('/:id/posts')
  @HttpCode(HttpStatus.OK)
  public async getUserPosts (@Param('id') id: string): Promise<PostView[]> {
    return await this.userFacade.findAllByUser({ id })
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getUserInfo (@Param('id') id: string): Promise<User> {
    return await this.userFacade.find({ id })
  }
}
