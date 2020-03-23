import {Controller, Get, Param} from '@nestjs/common'
import { CommentService } from './comment.service'
import { PostService } from '@/api/post/post.service'

@Controller('/api')
export class CommentController {

  constructor (
    private readonly commentService: CommentService,
    private readonly postService: PostService,
  ) {}

  @Get('comments/:post')
  async getComment (@Param('post') idx: number) {
    return await this.commentService.getComment(await this.postService.find(idx))
  }
}