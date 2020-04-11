import {CacheTTL, Controller, Get, Query, Param, HttpCode, HttpStatus} from '@nestjs/common'
import { UserEntity as User } from '@/entity'
import { Token } from '@/middle'
import { UserFacade } from './user.facade'

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userFacade: UserFacade,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getProfile (@Query('access_token') access_token) {
    return await this.userFacade.findProfile(access_token)
  }

  @Get('/posts')
  @HttpCode(HttpStatus.OK)
  public async getMyPosts (@Token() access_token: string) {
    return await this.userFacade.findAllByUser({ access_token })
  }

  @Get('/:id/posts')
  @HttpCode(HttpStatus.OK)
  public async getUserPosts (@Param('id') id: string) {
    return await this.userFacade.findAllByUser({ id })
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getUserInfo (@Param('id') id: string) {
    return await this.userFacade.find({ id })
  }
}
