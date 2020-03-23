import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { PostModule } from '@/api/post/post.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity as entity } from '@/entity'

const CommentEntity = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ PostModule, CommentEntity ],
  providers: [ CommentService ],
  controllers: [ CommentController ]
})
export class CommentModule {}