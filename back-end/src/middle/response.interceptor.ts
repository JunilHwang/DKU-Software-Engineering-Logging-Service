import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { Response } from '@/domain'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const success: boolean = true
    return next
            .handle()
            .pipe(
              catchError(err => throwError(new BadGatewayException())),
              map(result => ({ result, success })),
            )
  }

}