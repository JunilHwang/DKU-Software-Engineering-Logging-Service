import {
  Body, CACHE_MANAGER, CacheManagerOptions, CacheStore,
  CacheTTL,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post';

@Controller('/api/post')
export class PostController {
  constructor (
    private readonly postService: PostService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
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
    return await this.postService.find({ idx })
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createPost (@Body() postVO: PostVO, @Request() { cookies: { access_token } }) {
    if (!access_token) throw new UnauthorizedException()

    const writer = await this.userService.find({ access_token })
    if (!writer) throw new UnauthorizedException()

    await this.postService.create(writer, postVO)

    this.cacheManager.del('/api/post')

    return true
  }
}