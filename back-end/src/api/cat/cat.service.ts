import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cat.interface'

@Injectable()
export class CatService {
  constructor(@InjectModel('Cat') private readonly catModel: Model<Cat>) {}

  async create(cat: Cat): Promise<Cat> {
    console.log(cat);
    const createdCat = new this.catModel(cat);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}