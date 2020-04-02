import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common'
import { CommentService } from './comment.service'
import { PostService } from '@/api/post/post.service'
import { UserService } from '@/api/user/user.service'
import { CommentVO} from '@/domain'

@Controller('/api')
export class CommentController {

  constructor (
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get('/comments/:post')
  async getComments (@Param('post') post: number) {
    return await this.commentService.findCommentsByPost(post)
  }

  @Get('/comment/:idx')
  async getComment (@Param('idx') id: number) {
    return await this.commentService.findComment({ id })
  }

  @Post('/comment')
  @HttpCode(HttpStatus.CREATED)
  async createdComment (@Body() { post, content, parent }, @Request() { cookies: { access_token } }) {

    if ( !access_token ) throw new UnauthorizedException()

    const writer = await this.userService.find({ access_token })
    if ( !writer ) throw new UnauthorizedException()

    const postEntity = await this.postService.find({ idx: post })
    if ( !postEntity ) throw new BadRequestException()

    await this.commentService.create({ content, parent, writer, post: postEntity })

  }

  @Put('/comment/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment (@Param('idx') idx: number, @Body() commentVO: CommentVO) {
    await this.commentService.update(idx, commentVO)
  }

  @Delete('/comment/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment (@Param('idx') idx: number) {
    await this.commentService.delete({ idx })
  }
}