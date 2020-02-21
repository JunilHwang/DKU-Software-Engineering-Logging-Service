import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GithubModule } from './github/github.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [GithubModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
