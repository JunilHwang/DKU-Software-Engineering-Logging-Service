import { APP_INTERCEPTOR } from '@nestjs/core'
import { CacheModule, Module, CacheInterceptor } from '@nestjs/common'
import ApiModules from './api'
import { DatabaseModule } from '@/database'

const CacheProvider = {
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor,
}

@Module({
  imports: [ ...ApiModules, DatabaseModule, CacheModule.register() ],
  providers: [ CacheProvider ],
})
export class AppModule {}
