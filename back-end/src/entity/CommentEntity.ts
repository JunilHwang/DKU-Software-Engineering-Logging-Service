import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity as User, PostEntity as Post } from './index'

@Entity()
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
  writer: User

  @ManyToOne(type => Post, post => post.comments)
  post: Post
}