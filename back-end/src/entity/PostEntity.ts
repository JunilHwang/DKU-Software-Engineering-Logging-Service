import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity()
export class PostEntity {

  constructor ({ writer, title, content, repository, sha }) {
    this.writer = writer
    this.title = title
    this.content = content
    this.repository = repository
    this.sha = sha
  }

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

  @ManyToOne(type => UserEntity, writer => writer.posts)
  writer: UserEntity
}