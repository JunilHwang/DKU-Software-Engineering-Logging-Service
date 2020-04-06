import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity } from '@/entity'
import { PostModule } from '@/api/post/post.module'

const entities = TypeOrmModule.forFeature([ UserEntity ])

@Module({
  imports: [ entities, forwardRef(() => PostModule) ],
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ]
})
export class UserModule {}
