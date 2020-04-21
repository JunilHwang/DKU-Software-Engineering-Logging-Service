import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RankingEntity } from '@/api/ranking/ranking.entity'

const entities = TypeOrmModule.forFeature([ RankingEntity ])

@Module({
  imports: [ entities ],
})
export class RankingModule {}