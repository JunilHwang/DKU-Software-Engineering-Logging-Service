import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/UserEntity'
import { GithubProfile } from '@/domain/Github'
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  create (profile: GithubProfile, access_token: string): Promise<UserEntity> {
    const user = new UserEntity()
    user.profile = profile
    user.access_token = access_token
    return this.userRepository.save(user)
  }

  find (access_token: string): Promise<UserEntity|undefined> {
    return this.userRepository.findOne({ access_token })
  }
}
