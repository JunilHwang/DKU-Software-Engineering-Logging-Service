import { Inject, Injectable } from '@nestjs/common'
import { SSRService } from './ssr.service'
import { PostService } from '@/api/post/post.service'
import { UserService } from '@/api/user/user.service'
import { BundleRenderer } from 'vue-server-renderer'
import { PostEntity as Post, UserEntity as User } from '@/entity'

@Injectable()
export class SSRFacade {

  constructor(
    @Inject('SSRService') private readonly ssrService: SSRService,
    @Inject('PostService') private readonly postService: PostService,
    @Inject('UserService') private readonly usrService: UserService,
  ) {}

  async postRender (url: string, idx: number, access_token?: string): Promise<{ [k: string]: string }> {
    try {
      ([global['window'], global['document']] = this.ssrService.getDom(url));

      const renderer: BundleRenderer = this.ssrService.getRenderer()
      const selectedPost: Post = await this.postService.find({ idx })
      const user: User|undefined = await this.usrService.find({ access_token })
      const context = { url, selectedPost, user }
      const content: string = await renderer.renderToString(context)
      const title: string = `${selectedPost.title} | DKU Logging Service`
      global['window'].close()

      return { content, title }
    } catch (e) {
      return {
        content: '<div id="app"></div>',
        title: 'DKU SSR Service'
      }
    }
  }
}