import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UnauthorizedException } from '@nestjs/common'
import { CommentFacade } from './comment.facade'
import { CommentVO } from '@/domain'
import { CommentEntity as Comment, UserEntity as User, PostEntity } from '@/entity'
import { Token } from '@/middle'

@Controller('/api')
export class CommentController {

  constructor (
    private readonly commentFacade: CommentFacade,
  ) {}

  @Get('/comments/:post')
  getComments (@Param('post') post: number): Promise<Comment[]> {
    return this.commentFacade.findCommentsByPost(post)
  }

  @Get('/comment/:idx')
  getComment (@Param('idx') idx: number): Promise<Comment> {
    return this.commentFacade.findComment({ idx })
  }

  @Post('/comment')
  @HttpCode(HttpStatus.OK)
  createdComment (
    @Body() { post, content, to = '', parent = 0 },
    @Token() access_token: string
  ): Promise<Comment[]> {
    return this.commentFacade.create({ content, parent, to, access_token, post })
  }

  @Put('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  updateComment (
    @Param('idx') idx: number,
    @Body('content') content: string,
    @Token() access_token: string
  ): Promise<Comment[]> {
    return this.commentFacade.update(idx, content, access_token)
  }

  @Delete('/comment/:idx')
  @HttpCode(HttpStatus.OK)
  deleteComment (
    @Param('idx') idx: number,
    @Token() access_token: string
  ): Promise<Comment[]> {
    return this.commentFacade.delete(idx, access_token)
  }
}