import * as fs from 'fs'

export const UPLOADED_PATH: string = process.env.NODE_ENV === 'development'
                                     ? '/Users/junil/Desktop/Uploaded'
                                     : '/data/Uploaded'

export const saveBlob = (blob: string, path: string) => {
  removeBlob(path)
  const buffer = new Buffer(blob.split(',')[1], 'base64')
  const fullPath = `${UPLOADED_PATH}/${path}`
  try {
    fs.writeFileSync(fullPath, buffer)
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const removeBlob = (path: string) => {
  const fullPath = `${UPLOADED_PATH}/${path}`
  try {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
  } catch (e) {
    console.log(e)
    throw e
  }
}