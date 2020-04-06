import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
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

  public async create (writer: User, { content, title, sha, repository, description, thumbnail, route }: PostVO): Promise<void> {
    try {
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
      post.route = route
      post.writer = writer
      post.createdAt = Date.now()
      post.description = description
      post.thumbnail = isThumbnail

      if (isThumbnail) saveBlob(thumbnail, sha)

      await this.postRepository.save(post)
    } catch (e) {
      removeBlob(sha)
      throw new BadRequestException()
    }
  }

  public async findAll (): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({order: {idx: 'DESC'}})
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async findAllByUser (writerId: string): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({where: {writerId}, order: {idx: 'DESC'}})
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async find (params): Promise<Post> {
    try {
      const post = await this.postRepository.findOne(params)
      if (post === undefined) throw new NotFoundException()
      return post
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async delete (post: Post): Promise<void> {
    if (post.thumbnail) removeBlob(post.sha)
    try {
      await this.postRepository.remove(post)
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async update (idx: number, { content, title }: PostVO): Promise<void> {
    try {
      await this.postRepository.update(idx, { content, title })
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async like (idx: number, user: User): Promise<Post> {
    try {
      const post: Post = await this.find({idx})
      const index = post.likeUsers.findIndex(v => v.id === user.id)
      index !== -1
        ? post.likeUsers.splice(index, 1)
        : post.likeUsers.push(user)
      await this.postRepository.save(post)
      return post
    } catch (e) {
      throw new BadRequestException()
    }
  }
}