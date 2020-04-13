import {BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import { CommentEntity as Comment, PostEntity as Post, UserEntity as User } from '@/entity'
import { CommentService } from './comment.service'
import { UserService } from '@/api/user/user.service'
import { PostService } from '@/api/post/post.service'

interface CommentCreateVO {
  post: number
  content: string
  parent: number
  to: string
  access_token: string
}

@Injectable()
export class CommentFacade {

  constructor (
    @Inject('CommentService') private readonly commentService: CommentService,
    @Inject('UserService') private readonly userService: UserService,
    @Inject('PostService') private readonly postService: PostService
  ) {}

  findCommentsByPost (post: number): Promise<Comment[]> {
    try {
      return this.commentService.findCommentsByPost(post)
    } catch (e) {
      throw new BadRequestException('오류로 인하여 댓글 목록을 반환할 수 없습니다.')
    }

  }

  findComment (params): Promise<Comment|undefined> {
    try {
      return this.commentService.findComment(params)
    } catch (e) {
      throw new BadRequestException('오류로 인하여 댓글을 가져올 수 없습니다.')
    }
  }

  async create ({ post, content, parent, to, access_token }: CommentCreateVO): Promise<Comment[]> {
    try {
      const comment: Comment = new Comment()
      const postEntity: Post|undefined = await this.postService.find({ idx: post })
      if (postEntity === undefined) throw 'NotFound'

      comment.post = Promise.resolve(postEntity)
      comment.writer = await this.userService.findByToken(access_token)
      comment.parent = parent
      comment.createdAt = Date.now()
      comment.parent = parent
      comment.content = content

      if (parent === 0) {
        comment.od = await this.commentService.getOd(post)
      } else {
        comment.to = to
        const last: Comment = await this.commentService.getLastOfParent(parent)
        const od: number = last.od
        await this.commentService.incrementOdAfter({ od, post })
        comment.od = od + 1
      }
      await this.commentService.save(comment)
      return await this.findCommentsByPost(post)

    } catch (e) {
      switch (e) {
        case 'NotFound' : throw new BadRequestException('유효한 포스트가 아닙니다.')
        case 'ReLogin' : throw new UnauthorizedException('다시 로그인 해주세요')
        default: throw new BadRequestException('오류로 인하여 댓글 추가가 중단 되었습니다.')
      }
    }
  }

  async update (idx: number, content: string, access_token: string): Promise<Comment[]> {
    try {
      const writer: User = await this.userService.findByToken(access_token)
      const comment: Comment = await this.commentService.findComment({ idx })
      if (comment.writer.idx !== writer.idx) throw 'Auth'
      await this.commentService.update(idx, content)
      return this.findCommentsByPost((await comment.post).idx)
    } catch (e) {
      switch (e) {
        case 'Auth' : throw new ForbiddenException('수정 권한이 없습니다.')
        case 'ReLogin' : throw new UnauthorizedException('다시 로그인 해주세요')
        default: throw new BadRequestException('오류로 인하여 댓글 수정이 중단 되었습니다.')
      }
    }
  }

  async delete (idx: number, access_token: string): Promise<Comment[]> {
    try {
      const writer: User = await this.userService.findByToken(access_token)
      const comment: Comment = await this.commentService.findComment({ idx })
      if (comment.writer.idx !== writer.idx) throw 'Auth'
      const children: Comment[] = await this.commentService.findReply(idx)
      if (children.length > 0) throw 'Impossible'
      const post = (await comment.post).idx
      await this.commentService.delete(comment)
      return await this.commentService.findCommentsByPost(post)
    } catch (e) {
      switch (e) {
        case 'Auth' : throw new ForbiddenException('삭제 권한이 없습니다.')
        case 'ReLogin' : throw new UnauthorizedException('다시 로그인 해주세요')
        case 'Impossible' : throw new BadRequestException('답글이 있는 댓글은 삭제할 수 없습니다.')
        default: throw new BadRequestException('오류로 인하여 댓글을 삭제할 수 없습니다.')
      }
    }
  }
}