import * as fs from 'fs'
import { InternalServerErrorException } from '@nestjs/common'

export const UPLOADED_PATH = `${__dirname}/../static/uploaded`

export const httpResponseCheck = async (response: Promise<any>) => {
  try {
    const { statusText, status, config: { method, url }, data } = await response
    if (process.env.NODE_ENV !== 'production') console.log(method, url, status, statusText)
    return data
  } catch (e) {
    throw new InternalServerErrorException()
  }
}

export const saveBlob = (blob: string, path: string) => {
  const buffer = new Buffer(blob.split(',')[1], 'base64')
  const fullPath = `${UPLOADED_PATH}/${path}`
  fs.writeFileSync(fullPath, buffer)
}