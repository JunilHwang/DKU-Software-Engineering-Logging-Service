import { Controller, Get, Param, Render, Req } from '@nestjs/common'
import { SSRFacade } from './ssr.facade'
import { Request } from 'express'

@Controller()
export class SSRController {
  constructor (private readonly ssrFacade: SSRFacade) {}

  @Get(['/', '/user/*', '/setting'])
  @Render('dist/index')
  public getCSR(): { [k: string]: string } {
    const content: string = '<div id="app"></div>'
    const title: string = 'DKU Logging Service'
    return { content, title }
  }

  @Get('/post/:idx')
  @Render('dist/index')
  public getPostSSR(@Req() { url }: Request, @Param('idx') idx: number): Promise<{ [k: string]: string }> {
    return this.ssrFacade.postRender(url, idx)
  }

}