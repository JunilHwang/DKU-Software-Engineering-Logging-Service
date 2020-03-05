import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { GithubProfile } from '@/domain/Github';
import { PostEntity } from './PostEntity';

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

  @OneToMany(type => PostEntity, post => post.writer)
  posts: Promise<PostEntity[]>
}