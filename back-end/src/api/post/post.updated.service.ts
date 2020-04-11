import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  PostEntity as Post,
  PostUpdatedEntity as PostUpdated
} from '@/entity'

@Injectable()
export class PostUpdatedService {

  constructor (
    @InjectRepository(PostUpdated) private readonly postUpdatedRepository: Repository<PostUpdated>
  ) {}

  public async delete (post: Post): Promise<void> {
    try {
      await this.postUpdatedRepository.delete({ post })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async create (posts: Post[]): Promise<PostUpdated[]> {
    try {
      return await Promise.all<PostUpdated>(
        posts.map(v => {
          const postUpdated: PostUpdated = new PostUpdated()
          postUpdated.post = v
          postUpdated.createdAt = `${Date.now()}`
          postUpdated.updatedAt = '0'
          postUpdated.updated = false
          return this.postUpdatedRepository.save(postUpdated)
        })
      )
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async saveAll (updatedList: PostUpdated[]): Promise<PostUpdated[]> {
    try {
      return await this.postUpdatedRepository.save(updatedList)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}