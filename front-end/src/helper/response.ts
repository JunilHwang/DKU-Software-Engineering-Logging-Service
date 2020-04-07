import { AxiosResponse } from 'axios'
import { Response } from '@Domain'

export const responseProcessor = async <T>(response: Promise<AxiosResponse<Response<T>>>): Promise<T> => {
  try {
    const { data: { result } } = await response
    return result
  } catch ({ status, response: { data: { statusCode, path } } }) {
    throw statusCode
  }
}