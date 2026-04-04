import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export interface IBasePaginationRequest {
  page: number;
  perPage: number;
}

export class BasePaginationRequest implements IBasePaginationRequest {
  @ApiProperty({
    description: 'Номер страницы результатов поиска',
    minimum: 1,
    default: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'Количество результатов на страницу',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  perPage: number;
}
