import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request, Response } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  // @Get(['/', '/user/*', '/setting', '/post/:idx'])
  @Get(['/', '/user/*', '/setting'])
  @Render('dist/index')
  public getCSR() {
    return {
      content: '<div id="app"></div>',
      title: '단국대학교 개발자 커뮤니티',
      initData: '{}'
    }
  }

  @Get('/post/:idx')
  @Render('dist/index')
  public async getSSR(@Req() req: Request) {
    return {
      content: await this.appService.getSSR({ url: req.url }),
      title: '단국대학교 개발자 커뮤니티 - 포스트'
    }
  }
}
