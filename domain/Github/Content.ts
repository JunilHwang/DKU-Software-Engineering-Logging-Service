export type ContentLink = {
  self: string
  git: string
  html: string
}

type Content = {
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
  _links: ContentLink
}

export default Content