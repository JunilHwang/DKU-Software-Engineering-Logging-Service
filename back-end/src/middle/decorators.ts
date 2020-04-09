import { createParamDecorator, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

export const Token = createParamDecorator((data: undefined, req: Request): string => {
    const token: string|null = req.cookies.access_token || null
    if (token === null) throw new UnauthorizedException()
    return token
  },
);