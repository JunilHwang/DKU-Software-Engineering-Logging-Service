import { AxiosResponse } from 'axios'
import { Response } from '@Domain'
import { store } from '@/middleware'
import { eventBus } from '../helper'

export const responseProcessor = async <T>(response: Promise<AxiosResponse<Response<T>>>): Promise<T> => {
  try {
    const { data: { result } } = await response
    return result
  } catch (e) {
    if (e.status === 401) store.commit('user/SIGN_OUT')
    eventBus.$message({ type: 'error', message: e.response.message })
    throw e
  }
}