import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'ID пользователя.',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'URL адрес аватара.',
    type: String,
    format: 'uri',
  })
  avatar: string;

  @ApiProperty({ description: 'Имя пользователя.', type: String })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя.', type: String })
  lastName: string;

  @ApiProperty({
    description: 'Дата рождения пользователя.',
    type: Date,
    format: 'date',
  })
  birthday: Date;

  @ApiProperty({ description: 'Информация о пользователе.', type: String })
  about: string;

  @ApiProperty({
    description: 'Email пользователя.',
    type: String,
    format: 'email',
  })
  email: string;

  @ApiProperty({ description: 'Телефон пользователя.', type: String })
  phone: string;
}
