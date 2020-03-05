import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity()
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

  @ManyToOne(type => UserEntity, writer => writer.posts)
  writer: UserEntity
}