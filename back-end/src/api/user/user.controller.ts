import {CacheTTL, Controller, Get, Query} from '@nestjs/common'
import { UserService } from './user.service'

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheTTL(0)
  async getProfile (@Query('access_token') access_token) {
    return {
      success: true,
      result: await this.userService.find(access_token)
    }
  }
}
