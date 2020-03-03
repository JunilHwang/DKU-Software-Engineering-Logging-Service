import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository  } from '@nestjs/typeorm';
import { Cat } from './cat.interface'
import { CatEntity } from './cat.entity'
import { Repository } from 'typeorm';

@Injectable()
export class CatService {
  constructor(
    @InjectModel('Cat') private readonly catModel: Model<Cat>,
    @InjectRepository(CatEntity) private readonly catRepository: Repository<CatEntity>,
  ) {}


  /************************************/
  /* mongodb */
  /************************************/

  async createByModel (cat: Cat): Promise<Cat> {
    const createdCat = new this.catModel(cat);
    return createdCat.save();
  }

  async findAllByModel (): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  /************************************/
  /* mysql */
  /************************************/

  createByEntity(catDTO: Cat): Promise<CatEntity> {
    const cat = new CatEntity();
    cat.name = catDTO.name;
    cat.age = catDTO.age;
    cat.breed = catDTO.breed;

    return this.catRepository.save(cat);
  }

  findAllByEntity (): Promise<CatEntity[]> {
    return this.catRepository.find();
  }

  findOneByEntity (id: string): Promise<CatEntity> {
    return this.catRepository.findOne(id);
  }

  async removeByEntity (id: string): Promise<void> {
    await this.catRepository.delete(id);
  }
}