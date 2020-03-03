import {Controller, Get, Post, Body, Param, Delete} from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat } from './cat.interface';
import {CatEntity} from "@/api/cat/cat.entity";

@Controller('/api/cat')
export class CatController {
  constructor (private readonly catService: CatService) { }

  @Get('/model')
  getCat () {
    return this.catService.findAllByModel()
  }

  @Post('/model')
  async postCat (@Body() catDTO: Cat) {
    const result: Cat = await this.catService.createByModel(catDTO)
    return {
      success: true,
      result
    }
  }


  @Post('/entity')
  async create(@Body() catDTO: Cat) {
    const result: CatEntity = await this.catService.createByEntity(catDTO)
    return {
      success: true,
      result
    }
  }

  @Get('/entity')
  async findAll() {
    const result: CatEntity[] = await this.catService.findAllByEntity();
    return {
      success: true,
      result
    }
  }

  @Get('/entity/:id')
  async findOne(@Param('id') id: string) {
    const result: CatEntity = await this.catService.findOneByEntity(id);
    return {
      success: true,
      result
    }
  }

  @Delete('/entity/:id')
  async remove(@Param('id') id: string) {
    await this.catService.removeByEntity(id);
    return {
      success: true
    }
  }
}