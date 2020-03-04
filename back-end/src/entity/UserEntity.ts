import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GithubProfile } from '@/domain/Github';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  idx: number

  @Column()
  access_token: string

  @Column('simple-json')
  profile: GithubProfile

}