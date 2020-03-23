import { ViewColumn, ViewEntity } from 'typeorm'
import { GithubProfile } from '@/domain'

@ViewEntity({
  expression: `
    SELECT  p.idx, p.title, p.created_at as createdAt, p.description, p.thumbnail,
            u.id as writerId, u.profile as writerProfile,
            count(c.*) as comments, count(l.*) as likes
    FROM    "post" p
    JOIN    "user" u ON p.writer = u.idx
    JOIN    "like" l ON p.idx = l.post
    JOIN    "comment" c ON p.idx = c.post
    GROUP BY p.idx
    ORDER BY p.idx DESC
  `
})
export class PostViewEntity {
  @ViewColumn()
  idx: number

  @ViewColumn()
  title: string

  @ViewColumn()
  createdAt: number

  @ViewColumn()
  description: string

  @ViewColumn()
  thumbnail: string

  @ViewColumn()
  writerId: string

  @ViewColumn()
  writerProfile: GithubProfile

  @ViewColumn()
  comments: number

  @ViewColumn()
  likes: number
}