import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { GithubProfile } from 'domain/'

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
}