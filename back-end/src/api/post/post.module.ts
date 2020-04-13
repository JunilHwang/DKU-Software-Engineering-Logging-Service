import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from './post.controller'
import { PostFacade } from './post.facade'
import { PostService } from './post.service'
import { PostViewService } from './post.view.service'
import { PostUpdatedService } from './post.updated.service'
import { PostEntity, PostViewEntity, PostUpdatedEntity } from '@/entity'
import { UserModule } from '@/api/user/user.module'
import { CommentModule } from '@/api/comment/comment.module'
const entities = TypeOrmModule.forFeature([ PostEntity, PostViewEntity, PostUpdatedEntity ])

@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
    CacheModule.register(),
    entities
  ],
  controllers: [ PostController ],
  providers: [ PostService, PostViewService, PostUpdatedService, PostFacade ],
  exports: [ PostService, PostViewService, PostUpdatedService ]
})
export class PostModule {}