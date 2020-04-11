import { Body, CACHE_MANAGER, CacheStore, CacheTTL, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Put, UnauthorizedException } from '@nestjs/common'
import { PostVO } from '@/domain/Post'
import { PostEntity, PostViewEntity } from '@/entity'
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
  public async getPosts (): Promise<PostViewEntity[]> {
    return await this.postFacade.findAll()
  }

  @Get('/:idx')
  @HttpCode(HttpStatus.OK)
  @CacheTTL(60 * 60)
  public async getPost (@Param('idx') idx: number): Promise<PostEntity> {
    return await this.postFacade.find(idx)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createPost (
    @Body() postVO: PostVO,
    @Token() access_token: string
  ): Promise<PostEntity> {
    this.refreshCache()
    return await this.postFacade.create(access_token, postVO)
  }

  @Delete('/:idx')
  @HttpCode(HttpStatus.OK)
  public async deletePost (
    @Param('idx') idx: number,
    @Token() access_token: string
  ): Promise<PostViewEntity[]> {
    this.refreshCache(idx)
    return await this.postFacade.delete(idx, access_token)
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
    return await this.postFacade.update(post, uploaded, access_token)
  }

  @Patch('/:idx')
  @HttpCode(HttpStatus.OK)
  public async refreshPost (
    @Param('idx') idx: number,
    @Body('content') content: string,
    @Token() access_token: string
  ): Promise<PostEntity> {
    this.refreshCache(idx)
    return await this.postFacade.refresh(idx, content, access_token)
  }

  @Post('/like/:idx')
  @HttpCode(HttpStatus.OK)
  public async likePost (
    @Param('idx') idx: number,
    @Token() access_token: string
  ): Promise<PostEntity> {
    this.refreshCache(idx)
    return await this.postFacade.like(idx, access_token)
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