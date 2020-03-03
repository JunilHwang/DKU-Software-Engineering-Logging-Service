import * as mongoose from 'mongoose';
import { USER, PW, HOST, PORT, DBNAME } from './secret'

export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
        mongoose.connect(`mongodb://${USER}:${PW}@${HOST}:${PORT}/${DBNAME}`),
  },
];