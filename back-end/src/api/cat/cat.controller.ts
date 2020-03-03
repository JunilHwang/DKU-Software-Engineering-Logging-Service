import { Controller, Get, Post, Request } from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat } from "@/api/cat/cat.interface";

@Controller('/api/cat')
export class CatController {
  constructor (private readonly catService: CatService) { }

  @Get()
  getCat () {
    return this.catService.findAll()
  }

  @Post()
  async postCat (@Request() req) {
    const { body: cat } = req
    const result: Cat = await this.catService.create(cat)
    console.log(result)
    return {
      success: true,
      result
    }
  }
}