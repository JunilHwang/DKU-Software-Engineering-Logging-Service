import { APP_INTERCEPTOR } from '@nestjs/core'
import {CacheModule, Module, CacheInterceptor, NestModule, MiddlewareConsumer } from '@nestjs/common'
import ApiModules from './api'
import { MysqlModule, MongoModule } from '@/database'
import { LoggerMiddleware } from './middle/logger.middleware'

const moduleMetaData = {
  imports: [ ...ApiModules, MysqlModule, MongoModule, CacheModule.register() ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
}

@Module(moduleMetaData)
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/api/*');
  }
}
