import { SortTransform } from '@/common/decorators/sort-transform.decorator';
import { BasePaginationRequest, IBasePaginationRequest } from '@/common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export interface IPostListRequest extends IBasePaginationRequest {
  userId?: string;
  sort?: SortObject;
}

export class PostListRequest extends BasePaginationRequest {
  @ApiPropertyOptional({
    type: String,
    description: 'ID пользователя',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Поля для сортировки. Возможные ключи: createdAt',
    example: 'createdAt:asc',
  })
  @SortTransform(['createdAt'])
  @IsOptional()
  sort?: SortObject;
}
