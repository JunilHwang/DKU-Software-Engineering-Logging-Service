import { AxiosResponse } from 'axios'
import { Response } from '@Domain'
import { store } from '@/middleware'

export const responseProcessor = async <T>(response: Promise<AxiosResponse<Response<T>>>): Promise<T> => {
  try {
    const { data: { result } } = await response
    return result
  } catch ({ status, response: { data: { statusCode, path } } }) {
    if (statusCode === 401) store.commit('user/SIGN_OUT')
    throw statusCode
  }
}