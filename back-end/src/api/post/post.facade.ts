import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { PostService } from './post.service'
import { PostViewService } from './post.view.service'
import { PostUpdatedService  } from './post.updated.service'
import { UserService } from '@/api/user/user.service'
import { CommentService } from '@/api/comment/comment.service'
import { PostEntity as Post, PostViewEntity as PostView, UserEntity as User } from '@/entity'
import { PostVO } from "@/domain";
import { removeBlob, saveBlob } from "@/helper";

@Injectable()
export class PostFacade {
  constructor(
    @Inject('PostService') private readonly postService: PostService,
    @Inject('PostViewService') private readonly postViewService: PostViewService,
    @Inject('PostUpdatedService') private readonly postUpdatedService: PostUpdatedService,
    @Inject('CommentService') private readonly commentService: CommentService,
    @Inject('UserService') private readonly userService: UserService,
  ) { }

  public async create (access_token: string, { content, title, sha, repository, description, thumbnail, route }: PostVO): Promise<Post> {

    const existed: Post|undefined = await this.postService.find({ route })
    if (existed !== undefined) throw new BadRequestException('이미 등록된 포스트입니다.')

    const post: Post = new Post()
    const isThumbnail = thumbnail.length > 0
    post.title = title
    post.content = content
    post.sha = sha
    post.repository = repository
    post.route = route
    post.writer = await this.userService.findByToken(access_token)
    post.createdAt = Date.now()
    post.description = description
    post.thumbnail = isThumbnail

    if (isThumbnail) saveBlob(thumbnail, sha)

    try {
      await this.postService.saveAll([ post ])
    } catch (e) {
      throw new InternalServerErrorException('오류로 인하여 포스트를 등록할 수 없습니다.')
    }

    return post
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
      return await this.postViewService.findAllByUser(writerId)
    } catch (e) {
      throw new BadRequestException(`오류로 인하여 ${writerId}님이 작성 포스트 목록을 가져올 수 없습니다.`)
    }
  }

  public async findAllByRoute (routes: string[]): Promise<Post[]> {
    try {
      return await this.postService.findIn<string>('route', routes)
    } catch (e) {
      throw new BadRequestException('오류로 인하여 포스트 목록을 가져올 수 없습니다.')
    }
  }

  public async find (params): Promise<Post> {
    try {
      return await this.postService.find(params)
    } catch (e) {
      throw e === 'NotFound'
        ? new BadRequestException('해당 포스트를 찾을 수 없습니다.')
        : new InternalServerErrorException('오류로 인하여 포스트를 가져올 수 없습니다.')
    }
  }

  public async delete (idx: number, access_token: string): Promise<PostView[]> {
    const user: User = await this.userService.findByToken(access_token)

    try {

      const post: Post = await this.postService.find({ idx })

      if (user.idx !== post.writer.idx) throw 'Auth'

      removeBlob(post.sha)

      await this.commentService.deleteByPost(post)
      await this.postUpdatedService.delete(post)
      await this.postService.delete(post)

      return this.findAll()

    } catch (e) {
      throw e === 'Auth'
            ? new UnauthorizedException('삭제할 권한이 없습니다.')
            : new BadRequestException('오류로 인하여 포스트 삭제가 중단 되었습니다.')
    }
  }

  public async update (post: Post, uploaded: string, access_token: string): Promise<Post> {

    const user: User = await this.userService.findByToken(access_token)
    if (post.writer.idx !== user.idx) throw new UnauthorizedException('수정할 권한이 없습니다.')

    try {

      if (!post.thumbnail) {
        removeBlob(post.sha)
      } else if (post.thumbnail && uploaded !== `/uploaded/${post.sha}`) {
        saveBlob(uploaded, post.sha)
      }

      await this.postService.update(post)

    } catch (e) {
      throw new BadRequestException('오류로 인하여 포스트 수정이 중단 되었습니다.')
    }

    return this.find({ idx: post.idx })
  }

  public async refresh (idx: number, content: string, access_token: string): Promise<Post> {
    const user: User = await this.userService.findByToken(access_token)
    try {
      const post: Post = await this.find({ idx })
      if (post.writer.idx !== user.idx) throw 'Auth'
      post.content = content
      await this.postService.saveAll([ post ])
      return post
    } catch (e) {
      throw e === 'Auth'
            ? new UnauthorizedException('다시 로그인 해주세요')
            : new InternalServerErrorException('오류로 인하여 포스트 업데이트가 중단 되었습니다.')
    }
  }

  public async like (idx: number, access_token: string): Promise<Post> {
    const user: User = await this.userService.find(access_token)
    try {
      const post: Post = await this.postService.find({ idx })
      const index = post.likeUsers.findIndex(v => v.id === user.id)
      index !== -1
        ? post.likeUsers.splice(index, 1)
        : post.likeUsers.push(user)
      await this.postService.saveAll([ post ])
      return post
    } catch (e) {
      throw new BadRequestException('오류로 인하여 좋아요를 완료할 수 없습니다.')
    }
  }
}