import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common'
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
  async getComments (@Param('post') idx: number) {
    return await this.commentService.getCommentsByPost(await this.postService.find({ idx }))
  }

  @Post('comment')
  @HttpCode(HttpStatus.CREATED)
  async createdComment (@Body() { post, content, parent }, @Request() { cookies: { access_token } }) {

    await this.commentService.create({
      writer: await this.userService.find({ access_token }),
      post: await this.postService.find({ idx: post}),
      content, parent
    })

  }
}