import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity as User } from '@/entity'

@Entity({ name: 'project' })
export class ProjectEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  repo: string

  @Column({ name:'created_at', type: 'bigint' })
  createdAt: number

  @Column({ type: 'longtext' })
  introduction: string

  @Column()
  category: string

  @Column()
  tag: string

  @Column({ name: 'skill_set' })
  skillSet: string

  @Column()
  progress: number

  @Column({ name: 'due_at', type: 'bigint' })
  dueAt: number

  @ManyToMany(() => User)
  participant: User[]
}