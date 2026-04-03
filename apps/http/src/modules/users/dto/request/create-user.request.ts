import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Аватар пользователя',
    type: String,
    format: 'binary',
  })
  avatar: string;

  @ApiProperty({ description: 'Имя пользователя.', type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя.', type: String })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Дата рождения пользователя.',
    type: Date,
    format: 'date',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  birthday: Date;

  @ApiProperty({ description: 'Информация о пользователе.', type: String })
  @IsString()
  about: string;

  @ApiProperty({
    description: 'Email пользователя.',
    type: String,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Телефон пользователя.', type: String })
  @IsPhoneNumber('RU')
  phone: string;
}
