import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatModel } from './cat.schema';
import { CatEntity } from './cat.entity';

const models = MongooseModule.forFeature([ CatModel ])
const entities = TypeOrmModule.forFeature([ CatEntity ])

@Module({
  imports: [ models, entities ],
  controllers: [ CatController ],
  providers: [ CatService ],
})
export class CatModule {}