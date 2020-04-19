import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Request, Response } from 'express'
import { join } from 'path'
import * as express from 'express'
import { UPLOADED_PATH } from '@/helper'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'debug', 'warn', 'log', 'verbose']
  })
  const cookieParser = require('cookie-parser')
  const RESOURCE_PATH = join(__dirname, '../../resources')
  const STATIC_PATH = join(RESOURCE_PATH, 'static')
  const TEMPLATE_PATH = join(RESOURCE_PATH, 'templates')

  app.useStaticAssets(STATIC_PATH)
  app.setBaseViewsDir(TEMPLATE_PATH)
  app.setViewEngine('hbs')

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  app.use('/static', express.static(STATIC_PATH,{
    cacheControl: true,
    maxAge: 3600 * 1000,
    etag: false
  }))
  app.use('/uploaded', express.static(UPLOADED_PATH))
  app.use('/favicon.ico', express.static(RESOURCE_PATH + '/favicon.ico'))
  app.use(cookieParser())

  if (process.env.NODE_ENV === 'development') {
    app.use((req: Request, res: Response, next: Function) => {
      if (req.path.includes('/api')) console.log(`${req.method}:  ${req.path}`);
      next();
    })
  }

  await app.listen(process.env.NODE_ENV === 'production' ? 8080 : 3000)
}
bootstrap()
