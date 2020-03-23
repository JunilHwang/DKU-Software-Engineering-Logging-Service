import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import { Repository, TreeRepository} from 'typeorm'

@Injectable()
export class CommentService {

  constructor (
    @InjectRepository(Comment) private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  async findCommentsByPost (post: Post): Promise<Comment[]> {
    return await this.commentRepository.findTrees()
  }

  async findRoot (post: Post): Promise<Comment> {
    const comment: Comment|undefined = await this.commentRepository.findOne({ where: { post }, order: { id: 'ASC' } })
    if (comment !== undefined) return comment

    const rootComment = new Comment()
    rootComment.post = Promise.resolve(post)
    rootComment.content = 'rootComment'
    rootComment.createdAt = Date.now()
    return await this.commentRepository.save(rootComment)
  }

  async findParent (post: Post, parent: number|null): Promise<Comment> {
    return parent === null
           ? await this.findRoot(post)
           : await this.commentRepository.findOne({ where: { id: parent } })
  }

  async create ({ post, writer, content, parent }): Promise<void> {
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.parent = await this.findParent(post, parent)
    comment.content = content
    comment.createdAt = Date.now()

    await this.commentRepository.save(comment)
  }
}