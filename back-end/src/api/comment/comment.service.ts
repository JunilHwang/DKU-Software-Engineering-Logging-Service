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
    return this.commentRepository.find({ where: { post }, order: { od: 'ASC' } })
  }

  findComment (params): Promise<Comment|undefined> {
    return this.commentRepository.findOne(params)
  }

  async create ({ post, writer, content, parent }): Promise<void> {
    const lastEntity: Comment|undefined = await this.commentRepository.findOne({ where: { post }, order: { od: 'DESC' } })
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.parent = parent
    comment.content = content
    comment.createdAt = Date.now()

    if (parent === 0) {
      comment.od = lastEntity ? lastEntity.od + 1 : 0
      comment.depth = 0
    } else {
      // parent로 부터 시작하는 모든 답글을 가져온다.
      let { od, depth }: Comment = await this.findComment({ idx: parent })
      let before: number = parent
      do {
        const children: Comment|undefined = await this.commentRepository.findOne({
          select: [ 'idx', 'od' ],
          where: [ { parent: before } ],
          order: { od: 'DESC' },
        })
        if (children === undefined) break;
        ([before, od] = [children.idx, children.od])
      } while (true)

      await this.commentRepository.query(`UPDATE comment SET od =  od + 1 WHERE od > ${od}`)
      comment.od = od + 1
      comment.depth = depth + 1
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