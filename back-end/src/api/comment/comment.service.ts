import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import { TreeRepository} from 'typeorm'

@Injectable()
export class CommentService {

  constructor (
    @InjectRepository(Comment) private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  findCommentsByPost (post: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { post }, order: { od: 'ASC' } })
  }

  findParent (idx: number|null): Promise<Comment> {
    return this.commentRepository.findOne({ idx })
  }

  findComment (params): Promise<Comment|undefined> {
    return this.commentRepository.findOne(params)
  }

  async create ({ post, writer, content, parent }): Promise<void> {
    const lastEntity: Comment|undefined = await this.commentRepository.findOne({ where: { post },  order: { od: 'DESC' } })
    const parentEntity: Comment|undefined = await this.findParent(parent)
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.parent = Promise.resolve(parentEntity)
    comment.content = content
    comment.createdAt = Date.now()

    if (parentEntity === undefined) {
      comment.od = lastEntity ? lastEntity.od + 1 : 0
      comment.depth = 0
    } else {
      const { od, depth } = parentEntity
      await this.commentRepository.query(`UPDATE comment SET od =  od + 1 WHERE od > ${od}`)
      comment.od = od + 1
      comment.depth = depth + 1
    }


    await this.commentRepository.save(comment)
  }
}