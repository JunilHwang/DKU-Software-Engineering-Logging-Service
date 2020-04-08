import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import $http from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain/Github'
import { httpResponseCheck } from '@/helper';
import { InjectRepository } from '@nestjs/typeorm'
import {
  GithubHookEntity as GithubHook,
  UserEntity as User,
  PostEntity as Post,
  PostUpdatedEntity as PostUpdated
} from '@/entity'
import { Repository } from 'typeorm'
import { PostService } from '@/api/post/post.service'
import { Base64 } from 'js-base64'

const headers = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'request'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {

  constructor(
    @InjectRepository(GithubHook) private readonly githubHookRepository: Repository<GithubHook>,
    @Inject('PostService') private readonly postService: PostService
  ) {}

  public async getRepo (user: string, access_token: string): Promise<Array<GithubRepository>> {
    try {
      const Authorization = `token ${access_token}`
      const params = {sort: 'pushed', type: 'owner', direction: 'desc'}
      const url = `${BASE_URL}/users/${user}/repos`
      return await httpResponseCheck($http.get(url, {params, headers: {...headers, Authorization}}))
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  public async getContent (user: string, repo: string, path: string): Promise<GithubContent> {
    const url = `${BASE_URL}/repos/${user}/${repo}/contents/${path}`
    return await httpResponseCheck($http.get(url, { headers }))
  }

  public async getToken (code: string): Promise<GithubResponseToken> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    return await httpResponseCheck($http.post(`https://github.com/login/oauth/access_token`, params, { headers }))
  }

  public async getProfile (token: string): Promise<GithubProfile> {
    const headers = { Authorization: `token ${token}` }
    return await httpResponseCheck($http.get(`${BASE_URL}/user`, { headers }))
  }

  public async getTrees (user: string, repo: string, sha: string): Promise<GithubTrees> {
    return await httpResponseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/trees/${sha}`))
  }

  public async getBlob (user: string, repo: string, sha: string): Promise<GithubBlob> {
    return await httpResponseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/blobs/${sha}`))
  }

  public async getHook (user: User): Promise<GithubHook[]> {
    return await this.githubHookRepository.find({ user })
  }

  public async addHook (user: User, repo: string, token: string): Promise<GithubHook> {
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
    githubHook.data = await httpResponseCheck($http.post(requestURL, data, { headers }))
    await this.githubHookRepository.save(githubHook)

    return githubHook
  }

  public async removeHook (idx: number, token: string): Promise<void> {
    const hook: GithubHook = await this.githubHookRepository.findOne({ idx })
    const id: number = hook.data.id
    const requestURL = `${BASE_URL}/repos/${hook.repo}/hooks/${id}`
    const headers = { Authorization: `token ${token}` }
    await httpResponseCheck($http.delete(requestURL, {headers}))
    await this.githubHookRepository.remove(hook)
  }

  public async receiveHook (routes: string[]): Promise<number[]> {
    const isDev = process.env.NODE_ENV === 'development'
    const posts: Post[] = await this.postService.findAllByRoute(routes)
    if (posts.length === 0) return

    const updatedList: PostUpdated[] = await this.postService.createUpdated(posts)
    if (isDev) console.log('updatedList: ', updatedList)

    const contents: GithubContent[] = await Promise.all(posts.map(post => {
      const route: string = post.route
      const [ user, repo, ...pathArr ] = route.split('/')
      const path: string = pathArr.join('/')
      return this.getContent(user, repo, path)
    }))
    if (isDev) console.log('contents: ', contents)

    const updatedPosts: Post[] = await this.postService.saveAll(posts.map((v, k) => {
      const githubContent: GithubContent = contents[k]
      v.content = Base64.decode(githubContent.content)
        .replace(/!\[(.*)\]\(([.|/].*)\)/gim, `![$1](${githubContent.download_url}/../$2)`)
        .replace(/\[(.*)\]\(([.|/].*)\)/gim, `[$1](${githubContent.html_url}/../$2)`)
      return v
    }))
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
