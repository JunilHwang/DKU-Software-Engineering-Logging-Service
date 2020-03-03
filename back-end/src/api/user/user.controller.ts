import {CacheTTL, Controller, Get, Query} from '@nestjs/common'
import { UserService } from './user.service'
import { UserEntity } from './user.entity';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheTTL(60 * 60 * 24)
  async getProfile (@Query('access_token') access_token) {
    const user: UserEntity|undefined = await this.userService.find(access_token);
    return {
      success: true,
      result: user !== undefined ? user.profile : null
    }
  }
}
