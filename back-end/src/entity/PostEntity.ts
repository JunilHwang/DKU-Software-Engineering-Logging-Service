import {Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { UserEntity as User } from './UserEntity'

@Entity({ name: 'post' })
export class PostEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  title: string

  @Column({ type: 'longtext' })
  content: string

  @Column()
  repository: string

  @Column()
  sha: string

  @CreateDateColumn()
  reg_date: Date

  @ManyToOne(type => User, writer => writer.posts, { eager: true })
  @JoinTable()
  writer: User
}