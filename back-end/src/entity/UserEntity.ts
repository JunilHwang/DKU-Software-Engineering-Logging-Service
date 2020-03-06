import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { GithubProfile } from '@/domain/Github';
import { PostEntity as Post } from './PostEntity';

@Entity({ name: 'user' })
export class UserEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  id: string

  @Column()
  access_token: string

  @Column('simple-json')
  profile: GithubProfile

  @OneToMany(type => Post, post => post.writer)
  posts: Post[]
}