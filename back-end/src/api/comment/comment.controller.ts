import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common'
import { CommentService } from './comment.service'
import { PostService } from '@/api/post/post.service'
import { UserService } from '@/api/user/user.service'
import { CommentVO } from '@/domain'
import { CommentEntity as Comment, UserEntity as User, PostEntity } from '@/entity'
import { Token } from '@/middle'

@Controller('/api')
export class CommentController {

  constructor (
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get('/comments/:post')
  async getComments (@Param('post') post: number): Promise<Comment[]> {
    return await this.commentService.findCommentsByPost(post)
  }

  @Get('/comment/:idx')
  async getComment (@Param('idx') idx: number): Promise<Comment> {
    return await this.commentService.findComment({ idx })
  }

  @Post('/comment')
  @HttpCode(HttpStatus.OK)
  async createdComment (@Body() { post, content, to = '', parent = 0 }, @Token() access_token: string): Promise<Comment[]> {
    const writer: User = await this.userService.findByToken(access_token)
    const postEntity: PostEntity = await this.postService.find({ idx: post })
    if (!postEntity) throw new BadRequestException()
    await this.commentService.create({ content, parent, to, writer, post: postEntity })
    return await this.commentService.findCommentsByPost(post)
  }

  @Put('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  async updateComment (@Param('idx') idx: number, @Body() commentVO: CommentVO, @Token() access_token: string): Promise<Comment[]> {
    const writer: User = await this.userService.findByToken(access_token)
    const comment: Comment = await this.commentService.findComment({ idx })
    if (comment.writer.idx !== writer.idx) throw new UnauthorizedException()
    const post = await comment.post
    await this.commentService.update(idx, commentVO)
    return await this.commentService.findCommentsByPost(post.idx)
  }

  @Delete('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  async deleteComment (@Param('idx') idx: number, @Token() access_token: string): Promise<Comment[]> {
    const writer: User = await this.userService.findByToken(access_token)
    const comment: Comment = await this.commentService.findComment({ idx })
    if (comment.writer.idx !== writer.idx) throw new UnauthorizedException()
    const post = await comment.post
    await this.commentService.delete({ idx })
    return await this.commentService.findCommentsByPost(post.idx)
  }
}