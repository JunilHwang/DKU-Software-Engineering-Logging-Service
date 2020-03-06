import {Controller} from "@nestjs/common";
import {PostService} from "@/api/post/post.service";

@Controller('/api/post')
export class PostController {
  constructor (private readonly postService: PostService) {}
}