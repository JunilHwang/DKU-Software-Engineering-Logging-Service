import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectEntity } from './project.entity'

const entities = TypeOrmModule.forFeature([ ProjectEntity ])
@Module({
  imports: [ entities ]
})
export class ProjectModule {}