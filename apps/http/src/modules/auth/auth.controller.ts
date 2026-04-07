import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
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
import type { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { storage, fileFilter } from '@/common/utils';
import { AuthService } from './auth.service';
import { AuthResponse, SignInRequest, SignUpRequest } from './dto';
import { JwtAuthRefreshTokenGuard } from '@/common/guards';
import { User } from '@/common/decorators';
import type { IUser } from '@/common/interfaces';

@ApiTags('Авторизация')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'Регистрация пользователя.',
    summary: 'Регистрация пользователя.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SignUpRequest,
  })
  @ApiCreatedResponse({ type: AuthResponse })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage({
        path: 'avatars',
      }),
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter,
    }),
  )
  @Post('sign-up')
  signUp(
    @Body() dto: Omit<SignUpRequest, 'avatar'>,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() response: Response,
  ): Promise<ReturnType<Response['send']>> {
    return this.authService.signUp(dto, avatar, response);
  }

  @ApiOperation({
    description: 'Авторизация пользователя.',
    summary: 'Авторизация пользователя.',
  })
  @ApiOkResponse({ type: AuthResponse })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(
    @Body() dto: SignInRequest,
    @Res() response: Response,
  ): Promise<ReturnType<Response['send']>> {
    return this.authService.signIn(dto.email, dto.password, response);
  }

  @ApiOperation({
    description: 'Обновление токена пользователя.',
    summary: 'Обновление токена пользователя.',
  })
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ type: AuthResponse, description: 'success' })
  @UseGuards(JwtAuthRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(
    @User() user: IUser,
    @Res() response: Response,
  ): Promise<ReturnType<Response['send']>> {
    return this.authService.refreshToken(user, response);
  }

  @ApiOperation({
    description: 'Разлогирование пользователя.',
    summary: 'Разлогирование пользователя.',
  })
  @Post('sign-out')
  @ApiOkResponse({ type: AuthResponse, description: 'success' })
  @HttpCode(HttpStatus.OK)
  signOut(
    @Req() req: Request,
    @Res() res: Response,
  ): ReturnType<Response['send']> {
    return this.authService.signOut(req, res);
  }
}
