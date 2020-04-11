import { Body, CACHE_MANAGER, CacheStore, CacheTTL, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Put, UnauthorizedException } from '@nestjs/common'
import { PostVO } from '@/domain/Post'
import { UserEntity as User, PostEntity } from '@/entity'
import { Token } from '@/middle'
import { PostFacade } from './post.facade'

@Controller('/api/post')
export class PostController {
  constructor (
    private readonly postFacade: PostFacade,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getPosts () {
    return await this.postFacade.findAll()
  }

  @Get('/:idx')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getPost (@Param('idx') idx: number) {
    return await this.postFacade.find(idx)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createPost (@Body() postVO: PostVO, @Token() access_token: string): Promise<PostEntity> {

    this.refreshCache()

    return await this.postService.create(
      await this.userService.findByToken(access_token),
      postVO
    )
  }

  @Delete('/:idx')
  @HttpCode(HttpStatus.OK)
  public async deletePost (@Param('idx') idx: number, @Token() access_token: string) {

    this.refreshCache(idx)

    const post: PostEntity = await this.postService.find({ idx })
    const user: User = await this.userService.findByToken(access_token)

    if (user.idx !== post.writer.idx) throw new UnauthorizedException('삭제할 권한이 없습니다.')

    await this.commentService.deleteByPost(post)
    await this.postService.delete(post)

    return await this.postService.findAll()
  }

  @Put('/:idx')
  @HttpCode(HttpStatus.OK)
  public async updatePost (
    @Param('idx') idx: number,
    @Body('post') post: PostEntity,
    @Body('uploaded') uploaded: string,
    @Token() access_token: string
  ): Promise<PostEntity> {
    this.refreshCache(idx)
    const user: User = await this.userService.findByToken(access_token)
    if (post.writer.idx !== user.idx) throw new UnauthorizedException('수정할 권한이 없습니다.')
    return await this.postService.update(post, uploaded)
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
    try {
      this.cacheManager.del('/api/post')
      if (idx !== 0) this.cacheManager.del(`/api/post/${idx}`)
    } catch (e) {
      console.error(e)
    }
  }
}