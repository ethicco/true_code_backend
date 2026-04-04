import { ExposeApiProperty } from '@/common/decorators';

export class PostResponse {
  @ExposeApiProperty({ description: 'ID поста.', type: String })
  id: string;

  @ExposeApiProperty({ description: 'Текст поста.', type: String })
  text: string;

  @ExposeApiProperty({
    description: 'Изображения поста.',
    type: String,
    isArray: true,
  })
  images: Array<string>;

  @ExposeApiProperty({
    description: 'Дата создания поста.',
    type: Date,
    format: 'date-time',
  })
  createdAt: Date;
}
