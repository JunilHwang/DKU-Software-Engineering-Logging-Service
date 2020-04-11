import { BadRequestException, Catch, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import { TreeRepository} from 'typeorm'
import { CommentVO } from '@/domain'

@Injectable()
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

  async create ({ post, writer, content, parent, to }): Promise<void> {
    const comment: Comment = new Comment()
    comment.post = Promise.resolve(post)
    comment.writer = writer
    comment.parent = parent
    comment.createdAt = Date.now()
    comment.parent = parent
    comment.content = content

    if (parent === 0) {
      comment.od = await this.commentRepository.count({ post })
    } else {
      comment.to = to
      const last: Comment = await this.commentRepository.findOne({
        where: [ { idx: parent }, { parent } ],
        order: { od: 'DESC' }
      })
      const od: number = last.od
      await this.commentRepository.query(`UPDATE comment SET od = od + 1 WHERE post = ${(await post).idx} and od > ${od}`)
      comment.od = od + 1
    }

    await this.commentRepository.save(comment)
  }

  async update (idx: number, { content }: CommentVO) {
    await this.commentRepository.update(idx, { content })
  }

  async delete (params): Promise<void> {
    await this.commentRepository.delete(params)
  }

  async deleteByPost (post: Post): Promise<void> {
    const comments: Comment[] = await this.commentRepository.find({ where: { post } })
    await this.commentRepository.remove(comments)
  }
}