import { Type } from 'class-transformer';

import { ExposeApiProperty } from '../decorators';

export interface IPagination {
  page: number;
  perPage: number;
  totalCount: number;
}

export class PaginationMeta implements IPagination {
  @ExposeApiProperty({ example: 1, default: 1 })
  page: number;

  @ExposeApiProperty({ example: 10, default: 10 })
  perPage: number;

  @ExposeApiProperty({ example: 100 })
  totalCount: number;
}

export interface IBasePaginationResponse {
  meta: IPagination;
}

export class BasePaginationResponse implements IBasePaginationResponse {
  @ExposeApiProperty({ type: PaginationMeta })
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}
