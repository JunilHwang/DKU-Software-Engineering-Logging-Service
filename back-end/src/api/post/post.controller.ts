import { Body, CACHE_MANAGER, CacheStore, CacheTTL, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Put, Req, UnauthorizedException } from '@nestjs/common'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post'
import { UserEntity as User, PostEntity } from '@/entity'
import { CommentService } from '@/api/comment/comment.service'
import { Token } from '@/middle'

@Controller('/api/post')
export class PostController {
  constructor (
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
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
  public async createPost (@Body() postVO: PostVO, @Token() access_token: string) {

    await this.postService.create(
      await this.userService.findByToken(access_token),
      postVO
    )

    this.refreshCache()

    return true
  }

  @Delete('/:idx')
  @HttpCode(HttpStatus.OK)
  public async deletePost (@Param('idx') idx: number, @Token() access_token: string) {

    this.refreshCache(idx)

    const post: PostEntity = await this.postService.find({ idx })
    const user: User = await this.userService.findByToken(access_token)

    if (user.idx !== post.writer.idx) throw new UnauthorizedException()

    await this.commentService.deleteByPost(post)
    await this.postService.deleteUpdatedByPost(post)
    await this.postService.delete(post)

    return await this.postService.findAll()
  }

  @Put('/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost (@Param('idx') idx: number, @Body() postVO: PostVO) {
    this.refreshCache(idx)
    return await this.postService.update(idx, postVO)
  }

  @Patch('/:idx')
  @HttpCode(HttpStatus.OK)
  public async refreshPost (@Param('idx') idx: number, @Body('content') content: string, @Token() access_token: string): Promise<PostEntity> {
    this.refreshCache(idx)
    return await this.postService.refresh(idx, content, await this.userService.find({ access_token }))
  }

  @Post('/like/:idx')
  @HttpCode(HttpStatus.OK)
  public async likePost (@Param('idx') idx: number, @Token() access_token: string) {
    this.refreshCache(idx)
    return await this.postService.like(idx, await this.userService.find(access_token))
  }

  private refreshCache (idx: number = 0) {
    this.cacheManager.del('/api/post')
    if (idx !== 0) this.cacheManager.del(`/api/post/${idx}`)
  }
}