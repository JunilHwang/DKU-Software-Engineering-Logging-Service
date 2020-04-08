import { Body, CACHE_MANAGER, CacheStore, CacheTTL, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Put, Req, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { PostService } from './post.service'
import { UserService } from '@/api/user/user.service'
import { PostVO } from '@/domain/Post'
import { UserEntity as User, PostEntity } from '@/entity'
import { CommentService } from '@/api/comment/comment.service'

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
  public async getPosts () {
    return await this.postService.findAll()
  }

  @Get('/:idx')
  @HttpCode(HttpStatus.OK)
  public async getPost (@Param('idx') idx: number) {
    return await this.postService.find({ idx })
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createPost (@Body() postVO: PostVO, @Req() { cookies: { access_token } }: Request) {
    if (!access_token) throw new UnauthorizedException()

    const writer: User = await this.userService.find({ access_token })
    if (!writer) throw new UnauthorizedException()

    await this.postService.create(writer, postVO)

    this.refresh()

    return true
  }

  @Delete('/:idx')
  @HttpCode(HttpStatus.OK)
  public async deletePost (@Param('idx') idx: number, @Req() { cookies: { access_token } }: Request) {

    this.refresh(idx)

    const post: PostEntity = await this.postService.find({ idx })
    const user: User = await this.userService.find({ access_token })

    if (!(user && user.idx === post.writer.idx)) throw new UnauthorizedException()

    await this.commentService.deleteByPost(post)
    await this.postService.delete(post)

    return await this.postService.findAll()
  }

  @Put('/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost (@Param('idx') idx: number, @Body() postVO: PostVO) {
    this.refresh(idx)
    return await this.postService.update(idx, postVO)
  }

  @Patch('/:idx')
  @HttpCode(HttpStatus.OK)
  public async refreshPost (
    @Param('idx') idx: number,
    @Body('content') content: string,
    @Req() { cookies: { access_token } }: Request
  ): Promise<PostEntity> {
    this.refresh(idx)

    const user: User|undefined = await this.userService.find({ access_token })
    if (user === undefined) throw new UnauthorizedException()

    return await this.postService.refresh(idx, content)
  }

  @Post('/like/:idx')
  @HttpCode(HttpStatus.OK)
  public async likePost (@Param('idx') idx: number, @Req() { cookies: { access_token } }: Request) {
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