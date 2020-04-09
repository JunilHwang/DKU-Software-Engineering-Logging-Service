import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const token: string|null = request.cookies.access_token || null
    if (token === null) throw new UnauthorizedException()
    return token
  },
);