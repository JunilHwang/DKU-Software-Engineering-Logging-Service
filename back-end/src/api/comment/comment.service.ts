import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import { Repository } from 'typeorm'

@Injectable()
export class CommentService {

  constructor ( @InjectRepository(Comment) private readonly commentRepository: Repository<Comment> ) {}

  async getComment (post: Post): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { post } })
  }
}