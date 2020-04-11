import {Injectable, UnauthorizedException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity as User } from './user.entity'
import { GithubProfile } from '@/domain/Github'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public find (params): Promise<User|undefined> {
    try {
      return this.userRepository.findOne(params)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async findByToken (access_token: string): Promise<User> {
    try {
      const user: User | undefined = await this.userRepository.findOne({access_token})
      if (user === undefined) throw 'ReLogin'
      return user
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async create (profile: GithubProfile, access_token: string): Promise<User> {
    const [users, cnt] = await this.userRepository.findAndCount({ id: profile.login })
    const user = cnt === 0 ? new User() : users[0]
    user.id = profile.login
    user.profile = profile
    user.access_token = access_token
    return this.userRepository.save(user)
  }

}
