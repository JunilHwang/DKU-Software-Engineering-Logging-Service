import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/UserEntity'
import { GithubProfile } from '@/domain/Github'
import { Repository } from 'typeorm';
import {PostEntity} from "@/entity";

@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  public async create (profile: GithubProfile, access_token: string): Promise<UserEntity> {
    const [users, cnt] = await this.userRepository.findAndCount({ id: profile.login })
    const user = cnt === 0 ? new UserEntity() : users[0]
    user.id = profile.login
    user.profile = profile
    user.access_token = access_token
    return this.userRepository.save(user)
  }

  public find (params): Promise<UserEntity|undefined> {
    const user = { ...this.userRepository.findOne(params), access_token: null }
    return user
  }

  public async findPosts (params): Promise<PostEntity[]> {
    const writer = await this.find(params)
    const posts = await writer.posts
    return posts.map(v => (v.content = '', { ...v, writer })).sort((a, b) => b.idx - a.idx)
  }

}
