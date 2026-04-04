import { SortTransform } from '@/common/decorators/sort-transform.decorator';
import { BasePaginationRequest, IBasePaginationRequest } from '@/common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export interface IPostListRequest extends IBasePaginationRequest {
  sort: SortObject;
}

export class PostListRequest extends BasePaginationRequest {
  @ApiPropertyOptional({
    type: String,
    description: 'Поля для сортировки. Возможные ключи: createdAt',
    example: 'createdAt:asc',
  })
  @SortTransform(['createdAt'])
  @IsOptional()
  sort?: string;
}
