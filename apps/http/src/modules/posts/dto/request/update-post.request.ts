import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export interface IUpdatePostRequest {
  text?: string;
}

export class UpdatePostRequest implements IUpdatePostRequest {
  @ApiPropertyOptional({
    description: 'Текст для поста',
    type: String,
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    description: 'Новые изображения для поста',
    type: String,
    format: 'binary',
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  images?: string;

  @ApiPropertyOptional({
    description: 'Отредактированные изображения.',
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  imagesUrls?: string;
}
