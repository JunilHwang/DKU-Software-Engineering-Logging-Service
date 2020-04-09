import * as fs from 'fs'
import { Base64 } from 'js-base64'
import { GithubContent } from '@/domain'

export const UPLOADED_PATH: string = process.env.NODE_ENV === 'development'
                                     ? '/Users/junil/Desktop/Uploaded'
                                     : '/data/Uploaded'

export const saveBlob = (blob: string, path: string) => {
  const buffer = new Buffer(blob.split(',')[1], 'base64')
  const fullPath = `${UPLOADED_PATH}/${path}`
  removeBlob(path)
  fs.writeFileSync(fullPath, buffer)
}

export const removeBlob = (path: string) => {
  const fullPath = `${UPLOADED_PATH}/${path}`
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}

export const blobToContent = ({ content, download_url, html_url }: GithubContent) => {
  return Base64.decode(content)
    .replace(/!\[(.*)\]\(([.|/].*)\)/gim, `![$1](${download_url}/../$2)`)
    .replace(/\[(.*)\]\(([.|/].*)\)/gim, `[$1](${html_url}/../$2)`)
}