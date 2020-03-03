import { Connection } from 'mongoose';
import { CatSchema } from './cat.schema';

export const catProvider = [
  {
    provide: 'CAT_MODEL',
    useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];