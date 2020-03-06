import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UserEntity as User } from './UserEntity';

@Entity({ name: 'post' })
export class PostEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  repository: string

  @Column()
  sha: string

  @CreateDateColumn()
  reg_date: Date

  @ManyToOne(type => User, writer => writer.posts)
  writer: User

  set ({ writer, title, content, repository, sha }) {
    this.writer = writer
    this.title = title
    this.content = content
    this.repository = repository
    this.sha = sha
  }
}