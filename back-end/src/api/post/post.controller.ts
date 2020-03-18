import { Body, CACHE_MANAGER, CacheTTL, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Request } from '@nestjs/common'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post';

@Controller('/api/post')
export class PostController {
  constructor (
    private readonly postService: PostService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getPosts () {
    return await this.postService.findAll()
  }

  @Get('/:idx')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getPost (@Param('idx') idx: number) {
    return await this.postService.find(idx)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createPost (@Body() postVO: PostVO, @Request() { cookies: { access_token } }) {
    await this.postService.create(
      await this.userService.find({ access_token }),
      postVO
    )
    this.cacheManager.del('/api/post')
  }
}