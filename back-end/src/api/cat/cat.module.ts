import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatModel as model } from './cat.schema';
import { CatEntity as entity } from './cat.entity';

const CatModel = MongooseModule.forFeature([ model ])
const CatEntity = TypeOrmModule.forFeature([ entity ])

@Module({
  imports: [ CatModel, CatEntity ],
  controllers: [ CatController ],
  providers: [ CatService ],
})
export class CatModule {}