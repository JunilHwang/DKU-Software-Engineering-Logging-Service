import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { CacheModule, Module, CacheInterceptor }  from '@nestjs/common'
import ApiModules from './api'
import { MysqlModule, MongoModule } from '@/database'
import { HttpExceptionFilter, ResponseInterceptor } from '@/middle'


const moduleMetaData = {
  imports: [ ...ApiModules, MysqlModule, MongoModule, CacheModule.register() ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
}

@Module(moduleMetaData)
export class AppModule {}
