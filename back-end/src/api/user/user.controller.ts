import { CacheTTL, Controller, Get, Query, Request, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { UserEntity as User } from '@/entity';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheTTL(60 * 60 * 24)
  public async getProfile (@Query('access_token') access_token) {
    const user: User|undefined = await this.userService.find(access_token);
    return {
      success: true,
      result: user !== undefined ? user.profile : null
    }
  }

  @Get('/posts')
  @CacheTTL(60 * 60 * 24)
  public async getMyPosts (@Request() { cookies: { access_token } }) {
    const user: User = await this.userService.find({ access_token })
    return {
      success: true,
      result: await user.posts
    }
  }

  @Get('/:id/posts')
  @CacheTTL(60 * 60 * 24)
  public async getUserPosts (@Param('id') id: string) {
    const user: User = await this.userService.find({ id })
    return {
      success: true,
      result: await user.posts
    }
  }
}
