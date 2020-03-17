import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Request, Response } from 'express'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'warn', 'log', 'verbose']
  })
  const cookieParser = require('cookie-parser')
  app.use('/', express.static(`${__dirname}/static`))
  app.use(cookieParser())
  app.use((req: Request, res: Response, next: Function) => {
    console.log(`${req.method}:  ${req.path}`);
    next();
  })
  await app.listen(3000)
}
bootstrap()
