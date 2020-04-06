import {Entity, PrimaryGeneratedColumn} from 'typeorm'



@Entity({ name: 'github_hook' })
export class GithubHook {

  @PrimaryGeneratedColumn()
  idx: number


}