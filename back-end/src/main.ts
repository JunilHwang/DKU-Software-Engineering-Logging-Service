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
  const staticPath = join(__dirname, '/resources/static')

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));
  app.useStaticAssets(staticPath)
  app.setBaseViewsDir(staticPath)
  app.setViewEngine('hbs')

  app.use('/uploaded', express.static(UPLOADED_PATH))
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
