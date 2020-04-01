import {HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostEntity as Post, UserEntity as User, PostViewEntity as PostView } from '@/entity'
import { PostVO } from '@/domain/Post';
import { saveBlob, removeBlob } from '@/helper'

@Injectable()
export class PostService {

  constructor (
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostView) private readonly postViewRepository: Repository<PostView>
  ) {}

  public async create (writer: User, { content, title, sha, repository, description, thumbnail }: PostVO): Promise<void> {
    const cnt = await this.postRepository.count({ sha })

    if (cnt !== 0) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }

    const post: Post = new Post()
    const isThumbnail = thumbnail.length > 0

    post.title = title
    post.content = content
    post.sha = sha
    post.repository = repository
    post.writer = writer
    post.createdAt = Date.now()
    post.description = description
    post.thumbnail = isThumbnail

    if (isThumbnail) {
      saveBlob(thumbnail, sha)
    }

    try {
      await this.postRepository.save(post)
    } catch (e) {
      removeBlob(sha)
      throw new InternalServerErrorException()
    }
  }

  public async findAll (): Promise<PostView[]> {
    return await this.postViewRepository.find({ order: { idx: 'DESC' } })
  }

  public async findAllByUser (writerId: string): Promise<PostView[]> {
    return await this.postViewRepository.find({ where: { writerId },  order: { idx: 'DESC' } })
  }

  public async find (params): Promise<Post> {
    const post = await this.postRepository.findOne(params)
    if (post === undefined) throw new NotFoundException()
    return post
  }

  public async remove (params): Promise<void> {
    try {
      await this.postRepository.delete(params)
    } catch (e) {
      throw new InternalServerErrorException()
    }

  }
}