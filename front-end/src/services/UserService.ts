import $http from 'axios'
import { AccessToken } from '@/middleware/store/types/StateType';
import { GithubProfile, Post, User } from '@Domain';

const baseURI = '/api/user'

class UserService {
  async getMe (access_token: AccessToken): Promise<GithubProfile|null> {
    const params = { access_token }
    const { data } = await $http.get(baseURI, { params })
    return data.result
  }
  async getUser (id: string): Promise<User> {
    const { data } = await $http.get(`${baseURI}/${id}`)
    return data.result
  }
  async getUserPosts (userId: string): Promise<Post[]> {
    const { data } = await $http.get(`${baseURI}/${userId}/posts`)
    return data.result
  }
}

const userService = new UserService();

export default userService