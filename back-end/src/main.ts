import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Request, Response } from 'express'
import { join } from 'path'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'debug', 'warn', 'log', 'verbose']
  })
  const cookieParser = require('cookie-parser')
  app.use(cookieParser())

  if (process.env.NODE_ENV === 'develop') {
    app.use((req: Request, res: Response, next: Function) => {
      console.log(`${req.method}:  ${req.path}`);
      next();
    })
  }

  app.useStaticAssets(join(__dirname, '/resources/static'))
  app.setBaseViewsDir(join(__dirname, '/resources/static'))
  app.setViewEngine('hbs')

  app.use('/uploaded', express.static(`${__dirname}/resources/uploaded`))
  await app.listen(3000)
}
bootstrap()
