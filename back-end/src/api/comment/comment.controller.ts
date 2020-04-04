import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common'
import { CommentService } from './comment.service'
import { PostService } from '@/api/post/post.service'
import { UserService } from '@/api/user/user.service'
import { CommentVO } from '@/domain'
import { CommentEntity as Comment } from './comment.entity'

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
  async createdComment (@Body() { post, content, parent }, @Request() { cookies: { access_token } }): Promise<Comment[]> {

    if ( !access_token ) throw new UnauthorizedException()

    const writer = await this.userService.find({ access_token })
    if ( !writer ) throw new UnauthorizedException()

    const postEntity = await this.postService.find({ idx: post })
    if ( !postEntity ) throw new BadRequestException()

    await this.commentService.create({ content, parent, writer, post: postEntity })
    return await this.commentService.findCommentsByPost(post)
  }

  @Put('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  async updateComment (@Param('idx') idx: number, @Body() commentVO: CommentVO): Promise<Comment[]> {
    const comment: Comment = await this.commentService.findComment({ idx })
    const post = await comment.post
    await this.commentService.update(idx, commentVO)
    return await this.commentService.findCommentsByPost(post.idx)
  }

  @Delete('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  async deleteComment (@Param('idx') idx: number): Promise<Comment[]> {
    const comment: Comment = await this.commentService.findComment({ idx })
    const post = await comment.post
    await this.commentService.delete({ idx })
    return await this.commentService.findCommentsByPost(post.idx)
  }
}