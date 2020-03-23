import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent
} from "typeorm";
import { UserEntity as User, PostEntity as Post } from './index'

@Entity()
@Tree("nested-set")
export class CommentEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  createdAt: number

  @Column()
  depth: number

  @Column()
  od: number

  @Column({ type: "text" })
  content: string

  @ManyToOne(type => User)
  @JoinTable()
  writer: User

  @ManyToOne(type => Post)
  @JoinColumn()
  post: Promise<Post>

  @TreeChildren()
  children: CommentEntity[]

  @TreeParent()
  parent: CommentEntity
}