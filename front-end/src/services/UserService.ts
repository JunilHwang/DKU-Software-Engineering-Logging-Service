import $http from 'axios'
import { AccessToken } from '@/middleware/store/types/StateType'
import { GithubProfile, PostView, User } from '@Domain'
import { responseProcessor } from '@/helper'

const baseURI = '/api/user'

class UserService {
  async getMe (access_token: AccessToken): Promise<GithubProfile> {
    const params = { access_token }
    return await responseProcessor<GithubProfile>($http.get(baseURI, { params }))
  }
  async getUser (id: string): Promise<User> {
    return await responseProcessor<User>($http.get(`${baseURI}/${id}`))
  }
  async getUserPosts (userId: string): Promise<PostView[]> {
    return await responseProcessor<PostView[]>($http.get(`${baseURI}/${userId}/posts`))
  }
}

const userService = new UserService();

export default userService