import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export interface IUpdateUserRequest {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  about?: string;
  email?: string;
  phone?: string;
}

export class UpdateUserRequest implements IUpdateUserRequest {
  @ApiPropertyOptional({ description: 'Имя пользователя.', type: String })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Фамилия пользователя.', type: String })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Дата рождения пользователя.',
    type: Date,
    format: 'date',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({
    description: 'Информация о пользователе.',
    type: String,
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ description: 'Телефон пользователя.', type: String })
  @IsPhoneNumber('RU')
  @IsOptional()
  phone?: string;
}
