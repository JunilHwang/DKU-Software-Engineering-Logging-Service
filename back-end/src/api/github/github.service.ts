import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { default as $http, AxiosResponse } from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain/Github'
import { blobToContent } from '@/helper';
import { InjectRepository } from '@nestjs/typeorm'
import {
  GithubHookEntity as GithubHook,
  UserEntity as User,
  PostEntity as Post,
  PostUpdatedEntity as PostUpdated
} from '@/entity'
import { Repository } from 'typeorm'
import { PostService } from '@/api/post/post.service'

const BASE_URL = 'https://api.github.com'
const rateLimit: { [key: string]: number } = {
  limit: 0,
  remaining: 0,
  reset: 0,
}

export const responseCheck = async (response: Promise<AxiosResponse>) => {
  try {
    const { statusText, status, config: { method, url }, data } = await response
    if (process.env.NODE_ENV !== 'production')
      console.log(method, url, status, statusText)

    return data
  } catch ({ response }) {
    console.error(response)
    throw new InternalServerErrorException()
  }
}

@Injectable()
export class GithubService {

  constructor(
    @InjectRepository(GithubHook) private readonly githubHookRepository: Repository<GithubHook>,
    @Inject('PostService') private readonly postService: PostService
  ) {}

  public async getRepo (user: string, access_token: string): Promise<Array<GithubRepository>> {
    try {
      const headers = { Authorization: `token ${access_token}` }
      const params = {sort: 'pushed', type: 'owner', direction: 'desc'}
      const url = `${BASE_URL}/users/${user}/repos`
      return await responseCheck($http.get(url, { params, headers }))
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  public async getContent (user: string, repo: string, path: string): Promise<GithubContent> {
    const url = `${BASE_URL}/repos/${user}/${repo}/contents/${path}`
    return await responseCheck($http.get(url))
  }

  public async getToken (code: string): Promise<GithubResponseToken> {
    const params = { client_id, client_secret, code }
    const headers = { Accept: 'application/json' }
    return await responseCheck($http.post(`https://github.com/login/oauth/access_token`, params, { headers }))
  }

  public async getProfile (token: string): Promise<GithubProfile> {
    const headers = { Authorization: `token ${token}` }
    return await responseCheck($http.get(`${BASE_URL}/user`, { headers }))
  }

  public async getTrees (user: string, repo: string, sha: string): Promise<GithubTrees> {
    return await responseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/trees/${sha}`))
  }

  public async getBlob (user: string, repo: string, sha: string): Promise<GithubBlob> {
    return await responseCheck($http.get(`${BASE_URL}/repos/${user}/${repo}/git/blobs/${sha}`))
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
    githubHook.data = await responseCheck($http.post(requestURL, data, { headers }))
    await this.githubHookRepository.save(githubHook)

    return githubHook
  }

  public async removeHook (idx: number, token: string): Promise<void> {
    const hook: GithubHook = await this.githubHookRepository.findOne({ idx })
    const id: number = hook.data.id
    const requestURL = `${BASE_URL}/repos/${hook.repo}/hooks/${id}`
    const headers = { Authorization: `token ${token}` }
    await responseCheck($http.delete(requestURL, {headers}))
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
