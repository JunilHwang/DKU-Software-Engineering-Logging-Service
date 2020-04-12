import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity as Comment, PostEntity as Post } from '@/entity'
import { TreeRepository} from 'typeorm'

@Injectable()
export class CommentService {

  constructor (
    @InjectRepository(Comment) private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  public async findCommentsByPost (post: number): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({ where: { post }, order: { od: 'ASC' } })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async findComment (params): Promise<Comment|undefined> {
    try {
      return await this.commentRepository.findOne(params)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async getOd (post: number): Promise<number> {
    try {
      return await this.commentRepository.count({where: {post}})
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async getLastOfParent (parent: number): Promise<Comment> {
    try {
      return await this.commentRepository.findOne({
        where: [{idx: parent}, {parent}],
        order: {od: 'DESC'}
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async incrementOdAfter ({ post, od }: { [k: string]: number }): Promise<void> {
    try {
      await this.commentRepository.query(`UPDATE comment SET od = od + 1 WHERE post = ${post} and od > ${od}`)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async save (comment: Comment): Promise<Comment> {
    try {
      return await this.commentRepository.save(comment)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async update (idx: number, content: string) {
    try {
      await this.commentRepository.update(idx, { content })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async delete (params): Promise<void> {
    try {
      await this.commentRepository.delete(params)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async deleteByPost (post: Post): Promise<void> {
    try {
      const comments: Comment[] = await this.commentRepository.find({where: {post}})
      await this.commentRepository.remove(comments)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}