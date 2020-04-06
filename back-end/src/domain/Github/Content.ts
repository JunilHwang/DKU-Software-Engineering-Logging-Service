export interface ContentLink {
  self: string
  git: string
  html: string
}

export interface ContentVO {
  user: string
  repo: string
  path?: string
  sha?: string
}


export interface GithubContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  content?: string
  encoding?: string
  _links: ContentLink
}