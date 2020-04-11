import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
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

@Injectable()
export class GithubFacade {

  constructor(
    @Inject('GithubService') private readonly githubService: GithubService,
    @Inject('GithubHookService') private readonly githubHookService: GithubHookService,
    @Inject('PostService') private readonly postService: PostService,
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

  public getHooks ({ user, access_token }: { user?: User; access_token?: string }): Promise<GithubHook[]> {
    try {
      return this.githubHookService.getHooks({
        user: user ? user : await this.userService.findByToken(access_token)
      })
    } catch (e) {
      throw new BadRequestException('오류로 인하여 Hook 목록을 가져올 수 없습니다.')
    }
  }

  public async addHook (user: User, repo: string, token: string): Promise<GithubHook[]> {

    const exist: GithubHook[] = await this.githubHookService.getHooks({ repo })
    if (exist.length) throw new BadRequestException('이미 등록된 훅입니다.')

    try {
      const githubHook = new GithubHook()
      githubHook.repo = repo
      githubHook.user = user
      githubHook.data = await this.githubHookService.postHook({ repo, token })
      await this.githubHookService.saveHook(githubHook)
    } catch (e) {
      throw new BadRequestException('오류로 인하여 훅을 추가가 중단되었습니다.')
    }

    return await this.getHooks(user)
  }

  public async removeHook (idx: number, token: string): Promise<void> {
    const hook: GithubHook = await this.githubHookRepository.findOne({ idx })
    const id: number = hook.data.id
    const requestURL = `${BASE_URL}/repos/${hook.repo}/hooks/${id}`
    const headers = { Authorization: `token ${token}` }
    await responseCheck($http.delete(requestURL, { headers }))
    await this.githubHookRepository.remove(hook)
  }

  public async receiveHook (routes: string[]): Promise<number[]> {
    const isDev = process.env.NODE_ENV === 'development'
    const posts: Post[] = await this.postService.findAllByRoute(routes)
    if (posts.length === 0) return

    const updatedList: PostUpdated[] = await this.postService.createUpdated(posts)
    if (isDev) console.log('updatedList: ', updatedList)

    const contents: GithubContent[] = await Promise.all(posts.map(async post => {
      const route: string = post.route
      const [ user, repo, ...pathArr ] = route.split('/')
      const path: string = pathArr.join('/')
      return this.getContent(user, repo, path)
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
