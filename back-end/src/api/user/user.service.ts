import { Injectable} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity as User } from './user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public find (params: { id?: string; access_token?: string }): Promise<User|undefined> {
    try {
      return this.userRepository.findOne(params)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async findByToken (access_token: string): Promise<User> {
    try {
      const user: User|undefined = await this.find({ access_token })
      if (user === undefined) throw 'ReLogin'
      return user
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public save (user: User): Promise<User> {
    try {
      return this.userRepository.save(user)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

}
