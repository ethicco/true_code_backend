import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { storage, fileFilter } from './utils';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from './dto';

@ApiTags('Пользователи')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: 'Созднание пользователя.',
    summary: 'Созднание пользователя.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateUserRequest,
  })
  @ApiCreatedResponse({ type: UserResponse })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage(),
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter,
    }),
  )
  @Post('')
  create(
    @Body() dto: Omit<CreateUserRequest, 'avatar'>,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UserResponse> {
    return this.usersService.create(dto, avatar);
  }

  @ApiOperation({
    description: 'Получение профиля пользователя.',
    summary: 'Получение профиля пользователя.',
  })
  @ApiOkResponse({ type: UserResponse })
  @Get(':email')
  getByEmail(@Param('email') email: string): Promise<UserResponse> {
    return this.usersService.getByEmail(email);
  }

  @ApiOperation({
    description: 'Обновление профиля пользователя.',
    summary: 'Обновление профиля пользователя.',
  })
  @ApiOkResponse({ type: UserResponse })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRequest,
  ): Promise<UserResponse> {
    return this.usersService.updateProfile(id, dto);
  }

  @ApiOperation({
    description: 'Обновление аватара пользователя.',
    summary: 'Обновление аватара пользователя.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          description: 'Аватар пользователя',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UserResponse })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage(true),
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter,
    }),
  )
  @Patch(':id/avatar')
  updateAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.usersService.updataAvatar(id, avatar);
  }
}
