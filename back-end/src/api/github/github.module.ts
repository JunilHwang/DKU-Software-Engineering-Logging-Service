import { Module } from '@nestjs/common'
import { GithubController } from './github.controller'
import { GithubService } from './github.service'
import { UserModule } from '@/api/user/user.module'

@Module({
  imports: [ UserModule ],
  controllers: [ GithubController ],
  providers: [ GithubService ],
})
export class GithubModule {}
