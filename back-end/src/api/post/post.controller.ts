import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post';

@Controller('/api/post')
export class PostController {
  constructor (
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  @Get()
  public async getPosts () {
    return {
      success: true,
      result: await this.postService.findAll()
    }
  }

  @Get('/:idx')
  public async getPost (@Param('idx') idx: number) {
    return {
      success: true,
      result: await this.postService.find(idx)
    }
  }

  @Post()
  public async createPost (@Body() postVO: PostVO, @Request() { cookies }) {
    const writer = await this.userService.find(cookies.access_token)
    return {
      success: true,
      result: await this.postService.create(writer, postVO)
    }
  }
}