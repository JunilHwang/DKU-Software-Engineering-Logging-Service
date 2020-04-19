import { Inject, Injectable } from '@nestjs/common'
import {BundleRendererOptions, createBundleRenderer, createRenderer} from 'vue-server-renderer'
import { join } from 'path'
import { JSDOM } from 'jsdom'
import { PostService } from '@/api/post/post.service'
import { PostEntity as Post } from '@/entity'
import { SSRContext } from 'domain/'

const bundlePath = join(__dirname, '../../resources/vue-ssr-server-bundle.json');
const isDev = process.env.NODE_ENV === 'development'
const port = isDev ? 3000 : 8080
const baseURL = `http://localhost:${port}`
const htmlStr = `<!DOCTYPE html><html><head><title></title></head><body></body></html>`

@Injectable()
export class AppService {

  constructor(
    @Inject(PostService) private readonly postService: PostService
  ) { }

  public async getPostSSR (context: SSRContext): Promise<string> {
    const url: string = `${baseURL}${context.url}`
    const { window } = new JSDOM(htmlStr, { url })
    global['window'] = window
    global['document'] = window.document
    return createBundleRenderer(bundlePath, {
      runInNewContext: false,
      template: (result, context) => `${result}${context.renderState()}${context.renderScripts()}`
    } as any).renderToString(context)
  }

  public async getPost (idx: number): Promise<Post> {
    try {
      return await this.postService.find({idx})
    } catch (e) {
      console.error(e)
      return null
    }
  }
}