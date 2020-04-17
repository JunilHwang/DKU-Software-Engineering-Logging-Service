import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm'
import { GithubHookData } from 'domain/'
import { UserEntity as User } from '@/entity'

@Entity({ name: 'github_hook' })
export class GithubHookEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column({ unique: true })
  repo: string

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user' })
  user: User

  @Column('simple-json')
  data: GithubHookData
}