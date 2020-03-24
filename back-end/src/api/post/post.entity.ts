import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm'
import { CommentEntity as Comment, UserEntity as User} from '@/entity'

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

  thumbnail: string

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name: 'writer' })
  writer: User

  @ManyToMany(type => User, { eager: true })
  @JoinTable({
    name: 'like',
    joinColumn: {
      name: 'post',
      referencedColumnName: 'idx'
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'idx'
    }
  })
  likeUsers: User[]
}