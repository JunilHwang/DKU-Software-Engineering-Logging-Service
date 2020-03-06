import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostEntity as Post, UserEntity as User } from '@/entity'
import { PostVO } from '@/domain/Post';

@Injectable()
export class PostService {

  constructor (@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  public async create (writer: User, postVO: PostVO): Promise<boolean> {
    const post: Post = new Post()
    post.set({ writer, ...postVO })
    return (await this.postRepository.save(post)) === post
  }

  public async findAll (): Promise<Post[]> {
    return await this.postRepository.find()
  }

  public async find (idx: number): Promise<Post> {
    return await this.postRepository.findOne(idx)
  }
}