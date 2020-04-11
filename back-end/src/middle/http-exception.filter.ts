import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Response } from 'express'
import { APP_FILTER } from '@nestjs/core'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = exception.getStatus()

    ctx.getResponse<Response>().status(status).json(exception.getResponse())
  }
}

export const appExceptionFilter = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter
}