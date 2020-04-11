import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain/Github'
import { blobToContent } from '@/helper';
import {
  GithubHookEntity as GithubHook,
  UserEntity as User,
  PostEntity as Post,
  PostUpdatedEntity as PostUpdated
} from '@/entity'
import { GithubService } from './github.service'
import { GithubHookService } from './github.hook.service'
import { UserService } from '@/api/user/user.service'
import { PostService } from '@/api/post/post.service'
import { PostUpdatedService  } from '@/api/post/post.updated.service'

const isDev = process.env.NODE_ENV === 'development'

@Injectable()
export class GithubFacade {

  constructor(
    @Inject('GithubService') private readonly githubService: GithubService,
    @Inject('GithubHookService') private readonly githubHookService: GithubHookService,
    @Inject('PostService') private readonly postService: PostService,
    @Inject('PostUpdatedService') private readonly postUpdatedService: PostUpdatedService,
    @Inject('UserService') private readonly userService: UserService,
  ) {}

  public getRepo (user: string): Promise<GithubRepository[]> {
    try {
      return this.githubService.getRepo(user)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public getContent (params: { [k: string]: string }): Promise<GithubContent> {
    try {
      return this.githubService.getContent(params)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public getToken (code: string): Promise<GithubResponseToken> {
    try {
      return this.githubService.getToken(code)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public getProfile (token: string): Promise<GithubProfile> {
    try {
      return this.githubService.getProfile(token)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public getTrees (params: { [k: string]: string }): Promise<GithubTrees> {
    try {
      return this.githubService.getTrees(params)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public getBlob (params: { [k: string]: string }): Promise<GithubBlob> {
    try {
      return this.githubService.getBlob(params)
    } catch (e) {
      throw new InternalServerErrorException('Github API 요청 오류가 발생하였습니다.')
    }
  }

  public async getHooks ({ user, access_token }: { user?: User; access_token?: string }): Promise<GithubHook[]> {
    try {
      return this.githubHookService.getHooks({
        user: user ? user : await this.userService.findByToken(access_token)
      })
    } catch (e) {
      throw new BadRequestException('오류로 인하여 Hook 목록을 가져올 수 없습니다.')
    }
  }

  public async addHook ({ access_token, repo, token }: { [k: string]: string }): Promise<GithubHook[]> {
    try {
      const exist: GithubHook[] = await this.githubHookService.getHooks({ repo })
      if (exist.length) throw 'exist'
      const user: User = await this.userService.findByToken(access_token)
      const githubHook = new GithubHook()
      githubHook.repo = repo
      githubHook.user = user
      githubHook.data = await this.githubHookService.postHook({ repo, token })
      await this.githubHookService.saveHook(githubHook)
      return await this.getHooks({ user })
    } catch (e) {
      switch (e) {
        case 'exist': throw new BadRequestException('이미 등록된 Hook입니다.')
        case 'ReLogin': throw new UnauthorizedException('다시 로그인 해주세요.')
        default: throw new BadRequestException('오류로 인하여 Hook 추가가 중단되었습니다.')
      }
    }
  }

  public async removeHook (idx: number, token: string): Promise<void> {
    try {
      const user: User = await this.userService.findByToken(token)
      const hook: GithubHook = await this.githubHookService.getHook({ idx })
      if (user.idx !== hook.user.idx) throw 'Auth'
      const { data: { id }, repo }: GithubHook = hook
      return this.githubHookService.removeHook({ id, repo, token })
    } catch (e) {
      switch (e) {
        case 'Auth': throw new UnauthorizedException('삭제할 권한이 없습니다.')
        case 'ReLogin': throw new UnauthorizedException('다시 로그인 해주세요.')
        default: throw new BadRequestException('오류로 인하여 Hook 추가가 중단되었습니다.')
      }
    }
  }

  public async receiveHook (routes: string[]) {

    let posts: Post[]
    let updatedList: PostUpdated[]
    let contents: GithubContent[]

    try {
      posts = await this.postService.findIn('route', routes)
      if (posts.length === 0) return []
    } catch (e) { return [] }

    try {
      updatedList = await this.postUpdatedService.create(posts)
    } catch (e) { return [] }
    if (isDev) console.log('updatedList: ', updatedList)


    contents = await Promise.all(posts.map(async post => {
      const route: string = post.route
      const [ user, repo, ...pathArr ] = route.split('/')
      const path: string = pathArr.join('/')
      return this.githubService.getContent({ user, repo, path })
    }))

    if (isDev) console.log('contents: ', contents)

    const updatedPosts: Post[] = await this.postService.saveAll(
      posts.map((v, k) => (v.content = blobToContent(contents[k]), v))
    )
    if (isDev) console.log('updatedPosts: ', updatedPosts)

    const result: PostUpdated[] = await this.postService.saveUpdatedAll(updatedList.map(v => {
      v.updated = true
      v.updatedAt = `${Date.now()}`
      return v
    }))
    if (isDev) console.log('result: ', result)

    return updatedPosts.map(v => v.idx)

  }

}
