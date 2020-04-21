import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatisticEntity } from './statistic.entity'

const entities = TypeOrmModule.forFeature([ StatisticEntity ])

@Module({
  imports: [ entities ],
})
export class StatisticModule {}