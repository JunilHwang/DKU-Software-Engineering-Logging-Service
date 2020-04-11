import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { UserEntity as User } from './user.entity'
import { GithubProfile } from '@/domain'
import { UserService } from './user.service'
import { PostViewService } from '@/api/post/post.view.service'
import { PostViewEntity as PostView } from "@/api/post/post.view.entity";

@Injectable()
export class UserFacade {

  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('PostViewService') private readonly postViewService: PostViewService,
  ) {}

  public find (params): Promise<User|undefined> {
    try {
      return this.userService.find(params)
    } catch (e) {
      throw new InternalServerErrorException('오류로 인하여 회원 정보를 가져올 수 없습니다.')
    }
  }

  public async findProfile (access_token: string): Promise<GithubProfile|null> {
    try {
      const user: User|undefined = await this.userService.find({ access_token })
      return user !== undefined ? user.profile : null
    } catch (e) {
      throw new InternalServerErrorException('오류로 인하여 회원 정보를 가져올 수 없습니다.')
    }
  }

  public async findAllByUser (params: { access_token?: string; id?: string }): Promise<PostView[]> {
    try {
      const { id } = await this.userService.find(params)
      return await this.postViewService.findAllByUser(id)
    } catch (e) {
      throw new BadRequestException(`오류로 인하여 포스트 목록을 가져올 수 없습니다.`)
    }
  }

}
