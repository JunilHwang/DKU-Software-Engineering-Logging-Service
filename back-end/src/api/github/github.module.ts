import { CacheModule, Module } from '@nestjs/common'
import { GithubController } from './github.controller'
import { GithubAdapter } from './github.adapter'
import { GithubService } from './github.service'
import { GithubHookService } from './github.hook.service'
import { GithubFacade } from './github.facade'
import { UserModule } from '@/api/user/user.module'
import { PostModule } from '@/api/post/post.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GithubHookEntity as entity } from './github.hook.entity'

const entities = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ PostModule, UserModule, entities, CacheModule.register() ],
  controllers: [ GithubController ],
  providers: [ GithubAdapter, GithubHookService, GithubService, GithubFacade ]
})
export class GithubModule {}
