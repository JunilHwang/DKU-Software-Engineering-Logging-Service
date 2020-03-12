import * as fs from 'fs'

export const UPLOADED_PATH = `${__dirname}/../static/uploaded`

export const httpResponseCheck = async (response: Promise<any>) => {
  try {
    const { statusText, status, config, data } = await response
    const { method, url } = config
    console.log(method, url, status, statusText)
    return data
  } catch (e) {
    console.log('========== this is axios error ==========');
    throw e
  }
}

export const saveBlob = (blob: string, path: string) => {
  const buffer = new Buffer(blob.split(',')[1], 'base64')
  const fullPath = `${UPLOADED_PATH}/${path}`
  fs.writeFileSync(fullPath, buffer)
}