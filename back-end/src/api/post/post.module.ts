import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PostEntity, PostViewEntity, PostUpdatedEntity } from '@/entity'
import { UserModule } from '@/api/user/user.module'
import { CommentModule } from '@/api/comment/comment.module'
import { GithubModule } from '@/api/github/github.module'

const entities = TypeOrmModule.forFeature([ PostEntity, PostViewEntity, PostUpdatedEntity ])

@Module({
  imports: [
    forwardRef(() => GithubModule),
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
    CacheModule.register(),
    entities
  ],
  controllers: [ PostController ],
  providers: [ PostService ],
  exports: [ PostService ]
})
export class PostModule {}