import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { UserEntity as User, PostEntity as Post } from '@/entity'

@Entity({ name: 'comment' })
export class CommentEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  od: number

  @Column()
  depth: number

  @Column({ type: "text" })
  content: string

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number

  @Column({ type: 'boolean', default: false })
  deleted: boolean

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'writer' })
  writer: User

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post' })
  post: Promise<Post>

  @ManyToOne(() => CommentEntity)
  @JoinColumn({ name: 'parent' })
  parent: Promise<CommentEntity>
}