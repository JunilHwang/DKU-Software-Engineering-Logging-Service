import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostViewEntity as PostView } from '@/entity'

@Injectable()
export class PostViewService {

  constructor (
    @InjectRepository(PostView) private readonly postViewRepository: Repository<PostView>,
  ) {}

  public async findAll (): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({ order: { idx: 'DESC' } })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async findAllByUser (writerId: string): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({ where: { writerId }, order: { idx: 'DESC' }})
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}