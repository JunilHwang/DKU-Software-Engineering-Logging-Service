import {Injectable, UnauthorizedException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity as User } from './user.entity'
import { GithubProfile } from '@/domain/Github'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async create (profile: GithubProfile, access_token: string): Promise<User> {
    const [users, cnt] = await this.userRepository.findAndCount({ id: profile.login })
    const user = cnt === 0 ? new User() : users[0]
    user.id = profile.login
    user.profile = profile
    user.access_token = access_token
    return this.userRepository.save(user)
  }

  public find (params): Promise<User|undefined> {
    return this.userRepository.findOne(params)
  }

  public async findByToken (access_token: string): Promise<User> {
    const user: User|undefined = await this.userRepository.findOne({ access_token })
    if (user === undefined) throw new UnauthorizedException('다시 로그읺 ㅐ주세요')
    return user
  }

  public async getToken (id: string): Promise<string> {
    const sql: string = `SELECT access_token FROM user WHERE id = '${id}'`
    const [ { access_token } ]: User[] = await this.userRepository.query(sql)
    return access_token
  }

}
