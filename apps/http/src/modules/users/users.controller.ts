import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { storage, fileFilter } from './utils';
import { CreateUserRequest, UserResponse } from './dto';

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
  @ApiOkResponse({ type: UserResponse })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage,
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
}
