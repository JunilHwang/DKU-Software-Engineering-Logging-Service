import { Injectable } from '@nestjs/common'
import { createBundleRenderer } from 'vue-server-renderer'
import { join } from 'path'

const bundlePath = join(__dirname, '../../resources/vue-ssr-server-bundle.json');

@Injectable()
export class AppService {
  public getSSR (context: { [k: string]: string }): Promise<string> {
    const renderer = createBundleRenderer(bundlePath, {
      runInNewContext: false
    })
    return renderer.renderToString(context)
  }
}