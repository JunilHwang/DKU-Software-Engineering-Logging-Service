import { Injectable } from '@nestjs/common'
import { createBundleRenderer } from 'vue-server-renderer'
import { join } from 'path'
import { JSDOM } from 'jsdom'

const bundlePath = join(__dirname, '../../resources/vue-ssr-server-bundle.json');
const isDev = process.env.NODE_ENV === 'development'
const port = isDev ? 3000 : 8080
const baseURL = `http://localhost:${port}`

@Injectable()
export class AppService {
  public getSSR (context: { [k: string]: string }): Promise<string> {
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
}