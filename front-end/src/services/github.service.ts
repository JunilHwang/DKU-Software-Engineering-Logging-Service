import $http from 'axios'
const baseURI = '/api/github'

const GithubService = class {
  async getRepo (user: string): Promise<any> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    console.log(data)
    return data.result
  }
}

const githubService = new GithubService();

export default githubService