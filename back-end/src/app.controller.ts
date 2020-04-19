import { Controller, Get, Param, Render, Req } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'
import { PostEntity } from '@/api/post/post.entity'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get(['/', '/user/*', '/setting'])
  @Render('dist/index')
  public getCSR() {
    return {
      content: '<div id="app"></div>',
      title: 'DKU Logging Service',
      initState: null
    }
  }

  @Get('/post/:idx')
  @Render('dist/index')
  public async getSSR(@Req() req: Request, @Param('idx') idx: number) {
    const serialize: Function = require('serialize-javascript')
    const selectedPost: PostEntity = await this.appService.getPost(idx)
    const content: string = await this.appService.getPostSSR({ url: req.url, selectedPost })
    const title: string = `${selectedPost ? selectedPost.title : '페이지를 찾을 수 없습니다' } | DKU Logging Service`
    const initState = `<script>window.initPost = ${serialize(selectedPost)} </script>`
    return { content, title, initState }
  }
}
