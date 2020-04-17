import { Column, ViewColumn, ViewEntity } from 'typeorm'
import { GithubProfile } from 'domain/'

@ViewEntity({
  expression: `
    SELECT  p.idx, p.title, p.created_at as createdAt, p.description, p.thumbnail, p.sha,
            u.id as writerId, u.profile as writerProfile,
            count(c.post) as comments, count(l.post) as likes
    FROM    post p
    LEFT JOIN \`user\` u ON p.writer = u.idx
    LEFT JOIN \`like\` l ON p.idx = l.post
    LEFT JOIN comment c ON p.idx = c.post
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
  sha: string

  @ViewColumn()
  createdAt: number

  @ViewColumn()
  description: string

  @ViewColumn()
  thumbnail: string

  @ViewColumn()
  writerId: string

  @ViewColumn()
  @Column('simple-json')
  writerProfile: GithubProfile

  @ViewColumn()
  comments: number

  @ViewColumn()
  likes: number
}