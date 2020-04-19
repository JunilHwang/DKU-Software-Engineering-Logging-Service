import { Inject, Injectable } from '@nestjs/common'
import { SSRService } from './ssr.service'
import { PostService } from '@/api/post/post.service'
import { BundleRenderer } from 'vue-server-renderer'
import { PostEntity as Post } from '@/entity'

@Injectable()
export class SSRFacade {

  constructor(
    @Inject('SSRService') private readonly ssrService: SSRService,
    @Inject('PostService') private readonly postService: PostService,
  ) {}

  async postRender (url: string, idx: number): Promise<{ [k: string]: string }> {
    ([ global['window'], global['document'] ] = this.ssrService.getDom(url));

    const renderer: BundleRenderer = this.ssrService.getRenderer()
    const selectedPost: Post = await this.postService.find({ idx })
    const context = { url, selectedPost }
    const content: string = await renderer.renderToString(context)
    const title: string = `${selectedPost.title} | DKU Logging Service`
    global['window'].close()

    return { content, title }
  }
}