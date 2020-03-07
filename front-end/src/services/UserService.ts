import $http from 'axios'
import { AccessToken } from '@/middleware/store/types/StateType';
import { GithubProfile, Post } from '@Domain';

const baseURI = '/api/user'

class UserService {
  async getUser (access_token: AccessToken): Promise<GithubProfile|null> {
    const params = { access_token }
    const { data } = await $http.get(baseURI, { params })
    return data.result
  }
  async getUserPosts (): Promise<Post[]> {
    const { data } = await $http.get(`${baseURI}/posts`)
    return data.result
  }
}

const userService = new UserService();

export default userService