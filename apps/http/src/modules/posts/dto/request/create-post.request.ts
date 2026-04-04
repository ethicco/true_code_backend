import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export interface ICretePostRequest {
  userId: string;
  text: string;
}

export class CreatePostRequest implements Omit<ICretePostRequest, 'userId'> {
  @ApiProperty({ description: 'Текст поста.', type: String })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Изображения для поста',
    type: String,
    format: 'binary',
    isArray: true,
  })
  images: Array<string>;
}
