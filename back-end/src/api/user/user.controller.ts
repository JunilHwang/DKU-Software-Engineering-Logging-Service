import {CacheTTL, Controller, Get, Query, Request, Param, HttpCode, HttpStatus} from '@nestjs/common'
import { UserService } from './user.service'
import { PostService } from '@/api/post/post.service'
import { UserEntity as User } from '@/entity';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getProfile (@Query('access_token') access_token) {
    const user: User|undefined = await this.userService.find({ access_token })
    return user !== undefined ? user.profile : null
  }

  @Get('/posts')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getMyPosts (@Request() { cookies: { access_token } }) {
    const writer = await this.userService.find({ access_token })
    return await this.postService.findAllByUser(writer)
  }

  @Get('/:id/posts')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getUserPosts (@Param('id') id: string) {
    const writer = await this.userService.find({ id })
    return await this.postService.findAllByUser(writer)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60 * 24)
  public async getUserInfo (@Param('id') id: string) {
    return await this.userService.find({ id })
  }
}
