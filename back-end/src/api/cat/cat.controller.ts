import { Controller, Get } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller('/api/cat')
export class CatController {
  constructor (private readonly catService: CatService) { }

  @Get()
  getCat () {
    return this.catService.findAll()
  }
}