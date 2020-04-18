import { Inject, Injectable } from '@nestjs/common'
import { createBundleRenderer } from 'vue-server-renderer'
import { join } from 'path'
import { JSDOM } from 'jsdom'
import { PostService } from '@/api/post/post.service'
import { PostEntity as Post } from '@/entity'
import { SSRContext } from 'domain/'

const bundlePath = join(__dirname, '../../resources/vue-ssr-server-bundle.json');
const isDev = process.env.NODE_ENV === 'development'
const port = isDev ? 3000 : 8080
const baseURL = `http://localhost:${port}`

@Injectable()
export class AppService {

  constructor(
    @Inject(PostService) private readonly postService: PostService
  ) { }

  public getPostSSR (context: SSRContext): Promise<string> {
    const { window } = new JSDOM(`<!DOCTYPE html><html><head><title></title></head><body></body></html>`, {
      url: `${baseURL}${context.url}`
    })
    global['window'] = window
    global['document'] = window.document
    const renderer = createBundleRenderer(bundlePath, {
      runInNewContext: false
    })
    return renderer.renderToString(context)
  }

  public async getPost (idx: number): Promise<Post|null> {
    try {
      return await this.postService.find({idx})
    } catch (e) {
      console.error(e)
      return null
    }
  }
}