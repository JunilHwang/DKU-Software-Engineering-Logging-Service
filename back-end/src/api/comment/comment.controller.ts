import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { PostService } from '@/api/post/post.service'
import { UserService } from '@/api/user/user.service'

@Controller('/api')
export class CommentController {

  constructor (
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get('comments/:post')
  async getComments (@Param('post') post: number) {
    return await this.commentService.findCommentsByPost(post)
  }

  @Get('comment/:idx')
  async getComment (@Param('idx') id: number) {
    return await this.commentService.findComment({ id })
  }

  @Post('comment')
  @HttpCode(HttpStatus.CREATED)
  async createdComment (@Body() { post: postIdx, content, parent = null }, @Request() { cookies: { access_token } }) {

    if ( !access_token ) throw new UnauthorizedException()

    const writer = await this.userService.find({ access_token })
    if ( !writer ) throw new UnauthorizedException()

    const post = await this.postService.find({ idx: postIdx })
    if ( !post ) throw new BadRequestException()

    await this.commentService.create({ content, parent, writer, post })

  }
}