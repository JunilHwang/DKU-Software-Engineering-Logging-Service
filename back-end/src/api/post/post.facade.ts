import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { PostService } from './post.service'
import { PostViewService } from './post.view.service'
import { PostUpdatedService  } from './post.updated.service'
import { UserService } from '@/api/user/user.service'
import { CommentService } from '@/api/comment/comment.service'
import {
  PostEntity as Post,
  PostUpdatedEntity as PostUpdated,
  PostViewEntity as PostView,
  UserEntity as User
} from '@/entity'
import {PostVO} from "@/domain";
import {removeBlob, saveBlob} from "@/helper";
import {In} from "typeorm";

@Injectable()
export class PostFacade {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
    @Inject('PostViewService') private readonly postViewService: PostViewService,
    @Inject('PostUpdatedService') private readonly postUpdatedService: PostUpdatedService,
    @Inject('CommentService') private readonly commentService: CommentService,
    @Inject('UserService') private readonly userService: UserService,
  ) { }

  public async create (writer: User, { content, title, sha, repository, description, thumbnail, route }: PostVO): Promise<Post> {

    const cnt: number = await this.postRepository.count({ route })
    if (cnt !== 0) {
      throw new BadRequestException('이미 등록된 포스트입니다.')
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

    try {
      return await this.postRepository.save(post)
    } catch (e) {
      console.error(e)
      throw new InternalServerErrorException('오류로 인하여 포스트를 등록할 수 없습니다.')
    }
  }

  public async findAll (): Promise<PostView[]> {
    try {
      return await this.postViewService.findAll()
    } catch (e) {
      throw new BadRequestException('오류로 인하여 포스트한 목록을 가져올 수 없습니다.')
    }
  }

  public async findAllByUser (writerId: string): Promise<PostView[]> {
    try {
      return await this.postViewRepository.find({ where: { writerId }, order: { idx: 'DESC' }})
    } catch (e) {
      console.error(e)
      throw new BadRequestException(`오류로 인하여 ${writerId}님이 작성 포스트 목록을 가져올 수 없습니다.`)
    }
  }

  public async findAllByRoute (routes: string[]): Promise<Post[]> {
    try {
      return await this.postRepository.find({ route: In(routes) })
    } catch (e) {
      console.error(e)
      throw new BadRequestException('오류로 인하여 포스트 목록을 가져올 수 없습니다.')
    }
  }

  public async find (params): Promise<Post> {
    try {
      const post = await this.postRepository.findOne(params)
      if (post === undefined) throw 'NotFound'
      return post
    } catch (e) {
      console.error(e)
      throw e === 'NotFound'
        ? new BadRequestException('해당 포스트를 찾을 수 없습니다.')
        : new InternalServerErrorException('오류로 인하여 포스트를 가져올 수 없습니다.')
    }
  }

  public async delete (post: Post): Promise<void> {
    if (post.thumbnail) removeBlob(post.sha)
    try {
      await this.postUpdatedRepository.delete({ post })
      await this.postRepository.remove(post)
    } catch (e) {
      console.error(e)
      throw new BadRequestException('오류로 인하여 포스트 삭제가 중단 되었습니다.')
    }
  }

  public async update (post: Post, uploaded: string): Promise<Post> {
    if (!post.thumbnail) {
      removeBlob(post.sha)
    } else if (post.thumbnail && uploaded !== `/uploaded/${post.sha}`) {
      saveBlob(uploaded, post.sha)
    }

    const { idx, writer, likeUsers, ...postDetail } = post

    try {
      await this.postRepository.update(idx, postDetail)
    } catch (e) {
      console.error(e)
      throw new BadRequestException('오류로 인하여 포스트 수정이 중단 되었습니다.')
    }

    return this.find({ idx })
  }

  public async refresh (idx: number, content: string, user: User): Promise<Post> {
    const post: Post = await this.find({ idx })

    if (post.writer.idx !== user.idx) throw new UnauthorizedException('다시 로그인 해주세요')
    post.content = content

    try {
      await this.postRepository.save(post)
    } catch (e) {
      console.error(e)
      throw new InternalServerErrorException('오류로 인하여 포스트 업데이트가 중단 되었습니다.')
    }

    return post
  }

  public async like (idx: number, user: User): Promise<Post> {
    const post: Post = await this.find({ idx })
    const index = post.likeUsers.findIndex(v => v.id === user.id)
    index !== -1
      ? post.likeUsers.splice(index, 1)
      : post.likeUsers.push(user)

    try {
      await this.postRepository.save(post)
    } catch (e) {
      console.error(e)
      throw new BadRequestException('오류로 인하여 좋아요를 완료할 수 없습니다.')
    }

    return post
  }

  public async createUpdated (posts: Post[]): Promise<PostUpdated[]> {
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
      return []
    }
  }

  public async saveAll (posts: Post[]): Promise<Post[]> {
    try {
      return await this.postRepository.save(posts)
    } catch(e) {
      console.error(e)
      return []
    }
  }

  public async saveUpdatedAll (updatedList: PostUpdated[]): Promise<PostUpdated[]> {
    try {
      return await this.postUpdatedRepository.save(updatedList)
    } catch (e) {
      console.error(e)
      return []
    }
  }
}