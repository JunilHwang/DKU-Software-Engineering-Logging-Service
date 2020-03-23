import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import {Repository, TreeRepository} from 'typeorm'

@Injectable()
export class CommentService {

  constructor (
    @InjectRepository(Comment) private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  async getCommentsByPost (post: Post): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { post } })
  }

  async create ({ post, writer, content, parent }) {
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.content = content
    comment.createdAt = Date.now()
    if (parent) {
      comment.parent = await this.commentRepository.findOne({ idx: parent })
    }
    await this.commentRepository.save(comment)
  }
}