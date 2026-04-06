import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { fileFilter, storage } from '@/common/utils';
import { UpdateUserRequest, UserResponse } from './dto';
import { User } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';

@ApiBearerAuth('access-token')
@ApiTags('Пользователи')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: 'Получение профиля пользователя.',
    summary: 'Получение профиля пользователя.',
  })
  @ApiOkResponse({ type: UserResponse })
  @SerializeOptions({ type: UserResponse })
  @Get('me')
  getById(@User('id') id: string): Promise<UserResponse> {
    return this.usersService.getById(id);
  }

  @ApiOperation({
    description: 'Обновление профиля пользователя.',
    summary: 'Обновление профиля пользователя.',
  })
  @ApiOkResponse({ type: UserResponse })
  @SerializeOptions({ type: UserResponse })
  @Put()
  update(
    @User('id') id: string,
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
      storage: storage({ isUpdate: true, path: 'avatars' }),
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter,
    }),
  )
  @SerializeOptions({ type: UserResponse })
  @Patch('/avatar')
  updateAvatar(
    @User('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.usersService.updataAvatar(id, avatar);
  }
}
