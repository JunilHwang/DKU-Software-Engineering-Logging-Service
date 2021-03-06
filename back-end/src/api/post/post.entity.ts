import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm'
import { UserEntity as User} from '@/entity'
import { Post } from 'domain/dist'

@Entity({ name: 'post' })
export class PostEntity implements Post {

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
  route: string

  @Column()
  sha: string

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number

  @Column({ default: false })
  thumbnail: boolean

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'writer' })
  writer: User

  @ManyToMany(() => User, { eager: true })
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