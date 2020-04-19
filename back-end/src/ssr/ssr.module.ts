import { Module } from '@nestjs/common'
import { SSRFacade } from './ssr.facade'
import { SSRService } from './ssr.service'
import { SSRController } from './ssr.controller'
import { PostModule } from '@/api/post/post.module'
import { UserModule } from '@/api/user/user.module'

@Module({
  imports: [ PostModule, UserModule ],
  providers: [ SSRFacade, SSRService ],
  controllers: [ SSRController ],
  exports: [ SSRService ]
})
export class SSRModule {}