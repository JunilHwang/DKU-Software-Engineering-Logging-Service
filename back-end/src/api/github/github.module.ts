import { CacheModule, Module } from '@nestjs/common'
import { GithubController } from './github.controller'
import { GithubService } from './github.service'
import { UserModule } from '@/api/user/user.module'
import { PostModule } from '@/api/post/post.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GithubHookEntity as entity } from './github.hook.entity'

const entities = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ PostModule, UserModule, entities, CacheModule.register() ],
  controllers: [ GithubController ],
  providers: [ GithubService ]
})
export class GithubModule {}
