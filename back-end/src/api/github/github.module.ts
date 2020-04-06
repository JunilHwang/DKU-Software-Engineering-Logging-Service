import { Module } from '@nestjs/common'
import { GithubController } from './github.controller'
import { GithubService } from './github.service'
import { UserModule } from '@/api/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GithubHookEntity as entity } from './github.hook.entity'

const entities = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ UserModule, entities ],
  controllers: [ GithubController ],
  providers: [ GithubService ],
})
export class GithubModule {}
