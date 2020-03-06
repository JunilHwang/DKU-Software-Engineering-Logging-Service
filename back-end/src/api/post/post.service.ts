import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostEntity as Post, UserEntity as User } from '@/entity'
import { PostVO } from '@/domain/Post';

@Injectable()
export class PostService {

  constructor (@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  public async create (writer: User, { content, title, sha, repository }: PostVO): Promise<boolean> {
    const cnt = await this.postRepository.count({ sha })
    if (cnt !== 0) return false

    const post: Post = new Post()

    post.title = title
    post.content = content
    post.sha = sha
    post.repository = repository
    post.writer = writer

    return (await this.postRepository.save(post)) === post
  }

  public async findAll (): Promise<Post[]> {
    return await this.postRepository.find()
  }

  public async find (idx: number): Promise<Post> {
    return await this.postRepository.findOne(idx)
  }
}