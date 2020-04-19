import { createParamDecorator, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

export const Token = createParamDecorator((data: undefined, req: Request): string => {
    const token: string|null = req.cookies.access_token || null
    if (token === null) throw new UnauthorizedException()
    return token
  },
);

export const OptionalToken = createParamDecorator((data: undefined, req: Request): string => {
    return req.cookies.access_token
  },
);