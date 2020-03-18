import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Response } from '@/domain'
import { APP_INTERCEPTOR } from "@nestjs/core";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
            .handle()
            .pipe(
              map(result => ({ result, success: true })),
            )
  }
}

export const appResponseInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: ResponseInterceptor,
}