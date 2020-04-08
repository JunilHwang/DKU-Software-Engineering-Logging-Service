import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { PostEntity, PostViewEntity, PostUpdatedEntity } from '@/entity'
import { UserModule } from '@/api/user/user.module'
import { CommentModule } from '@/api/comment/comment.module'

const entities = TypeOrmModule.forFeature([ PostEntity, PostViewEntity, PostUpdatedEntity ])

@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
    entities
  ],
  controllers: [ PostController ],
  providers: [ PostService ],
  exports: [ PostService ]
})
export class PostModule {}