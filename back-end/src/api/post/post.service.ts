import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { PostEntity as Post } from '@/entity'

@Injectable()
export class PostService {

  constructor (
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

  public async findIn <T>(key: string, value: T[]): Promise<Post[]> {
    try {
      return await this.postRepository.find({ [key]: In(value) })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public find (params: { idx?: number; route?: string }): Promise<Post> {
    try {
      return this.postRepository.findOne(params)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async delete (post: Post): Promise<void> {
    try {
      await this.postRepository.remove(post)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async update (post): Promise<void> {
    const { idx, writer, likeUsers, ...postDetail } = post
    try {
      await this.postRepository.update(idx, postDetail)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async saveAll (posts: Post[]): Promise<Post[]> {
    try {
      return await this.postRepository.save(posts)
    } catch(e) {
      console.error(e)
      throw e
    }
  }
}