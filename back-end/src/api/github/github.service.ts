import { Injectable } from '@nestjs/common'
import $http from 'axios'
import { client_id, client_secret } from './secret'
import { GithubRepository, GithubContent, GithubResponseToken, GithubProfile, GithubTrees, GithubBlob } from '@/domain/Github'
import { httpResponseCheck } from '@/helper';
import { InjectRepository } from "@nestjs/typeorm";
import { GithubHookEntity as GithubHook } from "@/api/github/github.hook.entity";
import {Repository} from "typeorm";

const headers = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'request'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {

  constructor(
    @InjectRepository(GithubHook) private readonly githubHookRepository: Repository<GithubHook>
  ) {}

  public async getRepo (user: string, access_token: string): Promise<Array<GithubRepository>> {
    const Authorization = `token ${access_token}`
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const url = `${BASE_URL}/users/${user}/repos`
    return await httpResponseCheck($http.get(url, { params, headers: { ...headers, Authorization } }))
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

  public async addHook (user: string, repo: string) {
    const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:8080'
                : 'http://localhost:8080'

    const params = {
      name: '단국대학교 개발자 커뮤니티',
      active: true,
      events: [ 'push' ],
      config: {
        url,
        content_type: 'json',
        insecure_ssl: 0
      }
    }
    return await httpResponseCheck($http.post(`${BASE_URL}/repos/${user}/${repo}/hook`, params))
  }

}
