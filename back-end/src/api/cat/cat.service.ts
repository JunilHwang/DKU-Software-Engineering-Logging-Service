import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Cat } from './cat.interface'

@Injectable()
export class CatService {
  constructor(
    @Inject('CAT_MODEL')
    private readonly catModel: Model<Cat>,
  ) {}

  async create(cat: Cat): Promise<Cat> {
    const createdCat = new this.catModel(cat);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}