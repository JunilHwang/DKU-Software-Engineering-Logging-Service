import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { PostModule } from '@/api/post/post.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity } from '@/entity'
import { UserModule } from '@/api/user/user.module'

const entities = TypeOrmModule.forFeature([ CommentEntity ])

@Module({
  imports: [ PostModule, UserModule, entities ],
  providers: [ CommentService ],
  controllers: [ CommentController ]
})
export class CommentModule {}