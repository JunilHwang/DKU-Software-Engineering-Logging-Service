import {Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { GithubProfile } from '@/domain/Github';
import { PostEntity as Post } from './PostEntity';

@Entity({ name: 'user' })
export class UserEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  id: string

  @Column({ select: false })
  access_token: string

  @Column('simple-json')
  profile: GithubProfile

  @OneToMany(type => Post, post => post.writer)
  @JoinTable()
  posts: Promise<Post[]>
}