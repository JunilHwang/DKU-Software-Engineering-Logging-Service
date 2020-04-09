import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import {
  PostEntity as Post,
  UserEntity as User,
  PostViewEntity as PostView,
  PostUpdatedEntity as PostUpdated
} from '@/entity'
import { PostVO } from '@/domain/Post'
import { saveBlob, removeBlob } from '@/helper'

@Injectable()
export class PostService {

  constructor (
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostView) private readonly postViewRepository: Repository<PostView>,
    @InjectRepository(PostUpdated) private readonly postUpdatedRepository: Repository<PostUpdated>
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
      return await this.postViewRepository.find({ order: { idx: 'DESC' } })
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async findAllByUser (writerId: string): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({ where: { writerId }, order: { idx: 'DESC' }})
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async findAllByRoute (routes: string[]): Promise<Post[]> {
    try {
      return await this.postRepository.find({ route: In(routes) })
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

  public async refresh (idx: number, content: string, user: User): Promise<Post> {
    try {
      const post: Post = await this.find({ idx })
      if (post.writer.idx !== user.idx) throw new UnauthorizedException()
      const [ updated ] = await this.createUpdated([ post ])
      post.content = content
      updated.updatedAt = `${Date.now()}`
      updated.updated = true
      await this.postRepository.save(post)
      await this.saveUpdatedAll([ updated ])
      return post
    } catch (e) {
      throw new BadRequestException()
    }
  }

  public async like (idx: number, user: User): Promise<Post> {
    try {
      const post: Post = await this.find({ idx })
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

  public async createUpdated (posts: Post[]): Promise<PostUpdated[]> {
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
  }

  public async deleteUpdatedByPost (post: Post): Promise<void> {
    await this.postUpdatedRepository.delete({ post })
  }

  public async saveAll (posts: Post[]): Promise<Post[]> {
    return await this.postRepository.save(posts)
  }

  public async saveUpdatedAll (updatedList: PostUpdated[]): Promise<PostUpdated[]> {
    return await this.postUpdatedRepository.save(updatedList)
  }
}