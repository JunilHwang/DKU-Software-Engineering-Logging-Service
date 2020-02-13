import { Injectable } from '@nestjs/common'
import $http from 'axios'

const headers = {
  Accept: 'application/vnd.github.v3+json'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {
  async getRepo(user: string): Promise<any> {
    const { data } = await $http.get(`${BASE_URL}/users/${user}/repos`, { headers })
    return data
  }
}
