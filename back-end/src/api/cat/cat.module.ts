import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatSchema as schema } from './cat.schema';

const CatModel = MongooseModule.forFeature([{ name: 'Cat', schema }])

@Module({
  imports: [ CatModel ],
  controllers: [ CatController ],
  providers: [ CatService ],
})
export class CatModule {}