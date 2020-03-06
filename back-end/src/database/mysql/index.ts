import { TypeOrmModule } from '@nestjs/typeorm';
import { USERNAME, PASSWORD, HOST, PORT, DBNAME } from './secret'

export default TypeOrmModule.forRoot({
  type: 'mysql',
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DBNAME,
  synchronize: true,
  autoLoadEntities: true,
  timezone: 'Asia/Seoul'
  // logging: 'all'
})