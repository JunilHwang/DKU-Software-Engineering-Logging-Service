import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express'

@Controller()
export class AppController {
  constructor() {}

  @Get(['/', '/post/*', '/user/*'])
  @Render('index')
  getIndex(@Res() res: Response): void { }
}
