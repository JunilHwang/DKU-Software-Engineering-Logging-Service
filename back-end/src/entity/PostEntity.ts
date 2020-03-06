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

  @Column({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string

  @Column({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string

  @ManyToOne(type => User, writer => writer.posts, { eager: true })
  @JoinTable()
  writer: User
}