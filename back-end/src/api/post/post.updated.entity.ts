import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { PostEntity as Post } from "@/entity";

@Entity({ name: 'post_updated' })
export class PostUpdatedEntity {
  @PrimaryGeneratedColumn()
  idx: number

  @ManyToOne(() => Post, { eager: true, cascade: true })
  post: Post

  @Column({ name: 'created_at' })
  createdAt: string

  @Column({ name: 'updated_at' })
  updatedAt: string

  @Column({ default: false })
  updated: boolean
}