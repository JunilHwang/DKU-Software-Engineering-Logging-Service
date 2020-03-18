import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PostEntity as entity } from '@/entity'
import { UserModule } from '@/api/user/user.module'

const PostEntity = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ PostEntity, UserModule, CacheModule.register() ],
  controllers: [ PostController ],
  providers: [ PostService ],
})
export class PostModule {}