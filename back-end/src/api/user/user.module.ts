import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity as entity } from '../../entity/user.entity'

const UserEntity = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [UserEntity],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
