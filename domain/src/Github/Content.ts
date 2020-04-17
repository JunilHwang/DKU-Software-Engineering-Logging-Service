import { Base64 } from 'js-base64'
import { join } from 'path'

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
  content: string
  encoding?: string
  _links: ContentLink
}

export const blobToContent = ({ content, download_url, html_url }: GithubContent) => {
  console.log(join(download_url, '../$2'))
  console.log(join(html_url, '../$2'))
  return Base64.decode(content)
    .replace(/!\[(.*)\]\(([.|/].*)\)/gim, `![$1](${join(download_url, '..')}$2)`)
    .replace(/\[(.*)\]\(([.|/].*)\)/gim, `[$1](${join(html_url, '..')}$2)`)
}