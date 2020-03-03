import $http from 'axios'
import { AccessToken } from '@/middleware/store/StateType';
import { GithubProfile } from '@Domain/Github';

const baseURI = '/api/user'

class UserService {
  async getUser (access_token: AccessToken): Promise<GithubProfile|undefined> {
    const params = { access_token }
    const { data } = await $http.get(baseURI, { params })
    return data.result
  }
}

const userService = new UserService();

export default userService