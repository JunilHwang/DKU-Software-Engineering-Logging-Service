import { Controller, Get, Render, Req } from '@nestjs/common';
import {Request, Response} from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get()
  @Render('dist/index')
  public async getSSR(@Req() req: Request) {
    return {
      content: await this.appService.getSSR({ url: req.url }),
      title: 'SSR Success'
    }
  }
}
