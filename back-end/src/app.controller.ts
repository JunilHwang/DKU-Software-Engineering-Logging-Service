import { Controller, Get, Param, Render, Req } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get(['/', '/user/*', '/setting'])
  @Render('dist/index')
  public getCSR() {
    return {
      content: '<div id="app"></div>',
      title: '단국대학교 개발자 커뮤니티',
    }
  }

  @Get('/post/:idx')
  @Render('dist/index')
  public async getSSR(@Req() req: Request, @Param('idx') idx: number) {
    const selectedPost = await this.appService.getPost(idx)
    const content = await this.appService.getPostSSR({ url: req.url, selectedPost })
    return {
      content,
      title: `${selectedPost ? selectedPost.title : '페이지를 찾을 수 없습니다' } | DKU Logging Service`,
    }
  }
}
