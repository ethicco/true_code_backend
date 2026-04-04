import { BasePaginationResponse } from '@/common/dto';
import { PostResponse } from './post.response';
import { Type } from 'class-transformer';
import { ExposeApiProperty } from '@/common/decorators';

export class PostListResponse extends BasePaginationResponse {
  @ExposeApiProperty({
    description: 'Список постов.',
    type: PostResponse,
    isArray: true,
  })
  @Type(() => PostResponse)
  data: Array<PostResponse>;
}
