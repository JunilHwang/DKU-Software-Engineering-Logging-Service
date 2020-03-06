import { CacheTTL, Controller, Get, Query, Request } from '@nestjs/common'
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
  public async getUserPosts (@Request() { cookies }) {
    const user: User = await this.userService.find(cookies.access_token)
    return {
      success: true,
      result: await user.posts
    }
  }
}
