import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { UserEntity as User, PostEntity as Post } from '@/entity'

@Entity({ name: 'comment' })
@Tree("closure-table")
export class CommentEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column({ name: 'created_at' })
  createdAt: number

  @Column({ type: "text" })
  content: string

  @ManyToOne(type => User)
  @JoinColumn({ name: 'writer' })
  writer: User

  @ManyToOne(type => Post)
  @JoinColumn({ name: 'post' })
  post: Promise<Post>

  @TreeChildren()
  children: CommentEntity[]

  @TreeParent()
  parent: CommentEntity
}