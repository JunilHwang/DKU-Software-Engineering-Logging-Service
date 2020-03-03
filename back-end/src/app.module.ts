import { APP_INTERCEPTOR } from '@nestjs/core'
import { CacheModule, Module, CacheInterceptor } from '@nestjs/common'
import ApiModules from './api'
import { MysqlModule, MongoModule } from '@/database'

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
export class AppModule {}
