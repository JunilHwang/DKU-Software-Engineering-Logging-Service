import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity as entity } from '@/entity'
import { PostModule } from '@/api/post/post.module'

const UserEntity = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ UserEntity, PostModule ],
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ]
})
export class UserModule {}
