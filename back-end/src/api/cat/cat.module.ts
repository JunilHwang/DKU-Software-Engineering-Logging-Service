import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatSchema } from './cat.schema';

const CatModel = {
  provide: 'CAT_MODEL',
  useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
  inject: ['DATABASE_CONNECTION'],
}

@Module({
  controllers: [ CatController ],
  providers: [ CatService, CatModel ],
})
export class CatModule {}