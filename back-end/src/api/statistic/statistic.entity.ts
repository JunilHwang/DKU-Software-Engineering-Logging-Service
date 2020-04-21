import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity as User } from '@/api/user/user.entity'

@Entity({ name: 'statistic' })
export class StatisticEntity {
  @PrimaryGeneratedColumn()
  idx: number

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user' })
  user: User

  @Column()
  commits: number

  @Column()
  prs: number

  @Column()
  pr: number

  @Column()
  issues: number

  @Column()
  stars: number

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number
}