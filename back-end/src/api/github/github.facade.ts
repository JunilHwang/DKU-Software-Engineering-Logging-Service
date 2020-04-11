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
import { PostService } from '@/api/post/post.service'
import { GithubService } from './github.service'
import { GithubHookService } from './github.hook.service'
import { defaultAccessToken as token } from './secret'

@Injectable()
export class GithubFacade {

  constructor(
    @Inject('GithubService') private readonly githubService: GithubService,
    @Inject('GithubHookService') private readonly githubHookService: GithubHookService,
    @Inject('PostService') private readonly postService: PostService,
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

  public async getTrees (user: string, repo: string, sha: string): Promise<GithubTrees> {
    const headers = { Authorization: `Basic ${token}` }
    return await responseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/trees/${sha}`, { headers }))
  }

  public async getBlob (user: string, repo: string, sha: string): Promise<GithubBlob> {
    const headers = { Authorization: `Basic ${token}` }
    return await responseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/blobs/${sha}`, { headers }))
  }

  public async getHook (user: User): Promise<GithubHook[]> {
    return await this.githubHookRepository.find({ user })
  }

  public async addHook (user: User, repo: string, token: string): Promise<GithubHook[]> {
    const requestURL = `${BASE_URL}/repos/${repo}/hooks`
    const configURL = process.env.NODE_ENV === 'development'
      ? 'http://49.172.17.25:8080'
      : 'http://localhost:8080' // 추후에 변경 예
    const data = {
      name: 'web',
      active: true,
      events: [ 'push' ],
      config: {
        url: `${configURL}/api/github/hook/commit`,
        content_type: 'json',
        insecure_ssl: 0
      }
    }

    const headers = { Authorization: `token ${token}` }

    const count: number = await this.githubHookRepository.count({ repo })
    if (count !== 0) throw new BadRequestException()

    const githubHook = new GithubHook()
    githubHook.repo = repo
    githubHook.user = user
    githubHook.data = await responseCheck($http.post(requestURL, data, { headers }))
    await this.githubHookRepository.save(githubHook)

    return await this.getHook(user)
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
