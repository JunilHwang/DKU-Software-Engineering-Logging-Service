import { BadRequestException, Catch, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment } from '@/entity'
import { TreeRepository} from 'typeorm'
import { CommentVO } from '@/domain'

@Injectable()
@Catch(BadRequestException)
export class CommentService {

  constructor (
    @InjectRepository(Comment) private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  findCommentsByPost (post: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { post }, order: { od: 'DESC' } })
  }

  findComment (params): Promise<Comment|undefined> {
    return this.commentRepository.findOne(params)
  }

  async create ({ post, writer, content, parent }): Promise<void> {
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.parent = parent
    comment.createdAt = Date.now()
    comment.parent = parent
    comment.content = content

    if (parent === 0) {
      const last: Comment|undefined = await this.commentRepository.findOne({
        select: [ 'od' ],
        where: { post },
        order: { od: 'DESC' }
      })
      comment.od = last !== undefined ? last.od + 1 : 0
    } else {
      const parentEntity: Comment = await this.commentRepository.findOne({ idx: parent })
      comment.to = (await parentEntity.writer).id

      if (parentEntity.parent !== 0) {

      }
      const last: Comment|undefined = await this.commentRepository.findOne({
        select: [ 'od' ],
        where: [ { idx: parent }, { parent } ],
        order: { od: 'DESC' }
      })
      await this.commentRepository.query(`
        UPDATE comment SET od = od + 1 WHERE post = ${post} and od >= ${last.od};
      `)
      comment.od = last.od + 1
      comment.to =
    }

    await this.commentRepository.save(comment)
  }

  async update (idx: number, { content }: CommentVO) {
    await this.commentRepository.update(idx, { content })
  }

  async delete (params): Promise<void> {
    await this.commentRepository.delete(params)
  }
}