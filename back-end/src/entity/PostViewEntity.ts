import { ViewEntity} from 'typeorm'

@ViewEntity({
  expression: `
    SELECT  p.idx, p.title, p.createdAt, p.description, p.thumbnail, u.id as writerId,
            (  )
    FROM    "post" p
    JOIN    "user" u ON p.writer = u.idx
    
  `
})
export class PostViewEntity {

}