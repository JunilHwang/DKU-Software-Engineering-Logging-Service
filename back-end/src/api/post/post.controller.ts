import {
  Body, CACHE_MANAGER, CacheStore,
  CacheTTL,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param, Patch,
  Post, Put,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post'
import { UserEntity as User } from '@/api/user/user.entity'

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

    const writer: User = await this.userService.find({ access_token })
    if (!writer) throw new UnauthorizedException()

    await this.postService.create(writer, postVO)

    this.refresh()

    return true
  }

  @Delete('/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost (@Param('idx') idx: number) {
    this.refresh(idx)
    return await this.postService.delete({ idx })
  }

  @Put('/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost (@Param('idx') idx: number, @Body() postVO: PostVO) {
    this.refresh(idx)
    return await this.postService.update(idx, postVO)
  }

  @Patch('/:idx')
  @HttpCode(HttpStatus.OK)
  public async likePost (@Param('idx') idx: number, @Request() { cookies: { access_token } }) {
    this.refresh(idx)

    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    return await this.postService.like(idx, user)
  }

  private refresh (idx: number = 0) {
    this.cacheManager.del('/api/post')
    if (idx !== 0) this.cacheManager.del(`/api/post/${idx}`)
  }
}