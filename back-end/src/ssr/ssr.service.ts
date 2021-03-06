import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { BundleRenderer, createBundleRenderer } from 'vue-server-renderer'
import { DOMWindow, JSDOM } from 'jsdom'

const port = process.env.NODE_ENV === 'development' ? 3000 : 8080
const baseURL = `http://localhost:${port}`
const bundlePath = join(__dirname, '../../../resources/vue-ssr-server-bundle.json');
const htmlStr = `<!DOCTYPE html><html><head><title></title></head><body></body></html>`

@Injectable()
export class SSRService {

  public getRenderer (): BundleRenderer {
    try {
      return createBundleRenderer(bundlePath, {
        runInNewContext: false,
        template: (result, context) => `${result}${context.renderState()}${context.renderScripts()}`
      } as any)
    } catch (e) {
      console.log(e)
      throw 'Renderer Error'
    }
  }

  public getDom (contextURL: string): [ DOMWindow, Document ] {
    try {
      const url: string = `${baseURL}${contextURL}`
      const {window} = new JSDOM(htmlStr, {url})
      return [window, window.document]
    } catch (e) {
      console.log(e)
      throw 'JSDOM Error'
    }
  }
}