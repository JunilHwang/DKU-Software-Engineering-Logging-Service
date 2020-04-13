import { MongooseModule } from '@nestjs/mongoose';
import { HOST, PORT, DBNAME } from './secret'

const uri = `mongodb://${HOST}:${PORT}/${DBNAME}`;
const options = { useNewUrlParser: true }

export default MongooseModule.forRoot(uri, options)