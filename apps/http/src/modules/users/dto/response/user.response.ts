import { ExposeApiProperty } from '@/common/decorators';

export class UserResponse {
  @ExposeApiProperty({
    description: 'ID пользователя.',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ExposeApiProperty({
    description: 'URL адрес аватара.',
    type: String,
    format: 'uri',
  })
  avatar: string;

  @ExposeApiProperty({ description: 'Имя пользователя.', type: String })
  firstName: string;

  @ExposeApiProperty({ description: 'Фамилия пользователя.', type: String })
  lastName: string;

  @ExposeApiProperty({
    description: 'Дата рождения пользователя.',
    type: Date,
    format: 'date',
  })
  birthday: Date;

  @ExposeApiProperty({
    description: 'Информация о пользователе.',
    type: String,
  })
  about: string;

  @ExposeApiProperty({
    description: 'Email пользователя.',
    type: String,
    format: 'email',
  })
  email: string;

  @ExposeApiProperty({ description: 'Телефон пользователя.', type: String })
  phone: string;
}
