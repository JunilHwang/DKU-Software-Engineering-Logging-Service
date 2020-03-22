import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { UserEntity as User, CommentEntity as Comment } from './index'

@Entity({ name: 'post' })
export class PostEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ type: 'longtext' })
  content: string

  @Column()
  repository: string

  @Column()
  sha: string

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number

  @Column()
  thumbnail: string

  @ManyToOne(type => User, writer => writer.posts, { eager: true })
  @JoinTable()
  writer: User

  @ManyToMany(type => User, { eager: true })
  @JoinTable()
  likeUsers: User[]

  @ManyToMany(type => Comment, comment => comment.post, { eager: true })
  comments: Comment[]
}