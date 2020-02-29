import { APP_INTERCEPTOR } from '@nestjs/core'
import { CacheModule, Module, CacheInterceptor } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GithubModule } from './github/github.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [GithubModule, UserModule, CacheModule.register()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
