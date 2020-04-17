import { Module } from "@nestjs/common";
import { SSRService } from "@/api/ssr/ssr.service";

@Module({
  providers: [ SSRService ],
  exports: [ SSRService ]
})
export class SSRModule {

}