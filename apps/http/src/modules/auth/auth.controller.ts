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
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponse, SignUpRequest } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage, fileFilter } from '@/common/utils';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'Созднание пользователя.',
    summary: 'Созднание пользователя.',
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
  ): Promise<AuthResponse> {
    return this.authService.signUp(dto, avatar);
  }
}
