import $http from 'axios'
const baseURI = '/api/github'

interface ContentVO {
  user: string
  repo: string
  path: string
}

const GithubService = class {
  async getRepo (user: string): Promise<any> {
    const { data } = await $http.get(`${baseURI}/repo/${user}`)
    console.log(data)
    return data.result
  }

  async getContent (params: ContentVO): Promise<any> {
    const { data } = await $http.get(`${baseURI}/content`, { params })
    console.log(data)
    return data.result
  }
}

const githubService = new GithubService();

export default githubService