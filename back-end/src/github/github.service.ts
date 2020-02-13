import { Injectable } from '@nestjs/common'
import $http from 'axios'

const headers = {
  Accept: 'application/vnd.github.v3+json'
}

const BASE_URL = 'https://api.github.com'

@Injectable()
export class GithubService {
  async getRepo(user: string): Promise<any> {
    const params = { sort: 'pushed', type: 'owner', direction: 'desc' }
    const response = await $http.get(`${BASE_URL}/users/${user}/repos`, { params, headers });
    const { data, status } = response
    return status === 200 ? data : null
  }
}
