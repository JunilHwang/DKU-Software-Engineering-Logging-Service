import { AxiosResponse } from 'axios'
import { Response } from '@Domain'

export const responseProcessor = async <T>(response: Promise<AxiosResponse<Response<T>>>, isStatus: number): Promise<T|undefined> => {
  try {
    const { data: { result }, status } = await response
    return isStatus === status ? result : undefined
  } catch ({ status, response: { data: { statusCode, path } } }) {
    throw `${statusCode}, ${path}`
  }
}