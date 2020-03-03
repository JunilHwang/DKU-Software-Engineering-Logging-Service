import { MongooseModule } from '@nestjs/mongoose';
import { USER, PW, HOST, PORT, DBNAME } from './secret'

const uri = `mongodb://${HOST}:${PORT}/${DBNAME}`;
const options = { useNewUrlParser: true }

console.log(uri)

export const DatabaseModule = MongooseModule.forRoot(uri, options)