import { CacheModule, Module } from '@nestjs/common'
import ApiModules from './api'
import { MysqlModule } from '@/database'
import { appCacheInterceptor, appResponseInterceptor, appExceptionFilter } from '@/middle'
import { AppController } from '@/app.controller'
import { AppService } from './app.service'

const moduleMetaData = {
  imports: [ ...ApiModules, MysqlModule, CacheModule.register() ],
  controllers: [ AppController ],
  providers: [ AppService, appResponseInterceptor, appCacheInterceptor, appExceptionFilter ],
}

@Module(moduleMetaData)
export class AppModule {}
