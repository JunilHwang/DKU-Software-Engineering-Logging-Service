import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity as User, PostEntity as Post } from '@/entity'

@Entity({ name: 'comment' })
export class CommentEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column({ default: 0 })
  parent: number

  @Column({ default: 0 })
  od: number

  @Column({ type: "text" })
  content: string

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number

  @Column({ default: '' })
  to: string

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'writer' })
  writer: User

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post' })
  post: Promise<Post>
}