import { AxiosResponse } from 'axios'
import { Response } from '@Domain'
import { eventBus } from './index'

export const responseProcessor = async <T>(response: Promise<AxiosResponse<Response<T>>>, isStatus: number): Promise<T|undefined> => {
  try {
    const { data: { result }, status } = await response
    return isStatus === status ? result : undefined
  } catch ({ status, response: { data: { statusCode, path } } }) {
    eventBus.$message({ type: 'error', message: `${statusCode} is not ${isStatus}` })
    throw `${statusCode}, ${path}`
  }
}