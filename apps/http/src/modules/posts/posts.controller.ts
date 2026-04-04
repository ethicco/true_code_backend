import {
  Body,
  Controller,
  Post,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards';
import { CreatePostRequest, PostResponse } from './dto';
import { PostsService } from './posts.service';
import { User } from '@/common/decorators';
import { IUser } from '@/common/interfaces';
import { fileFilter, storage } from '@/common/utils';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth('access-token')
@ApiTags('Поcты')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'posts', version: '1' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    description: 'Созднание поста.',
    summary: 'Созднание поста.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 5,
        },
      ],
      {
        storage: storage({ path: 'posts' }),
        limits: { fileSize: 1 * 1024 * 1024 },
        fileFilter,
      },
    ),
  )
  @SerializeOptions({ type: PostResponse })
  @Post()
  create(
    @User('id') id: string,
    @Body() dto: CreatePostRequest,
    @UploadedFiles() { images }: { images: Array<Express.Multer.File> },
  ): Promise<PostResponse> {
    return this.postsService.create(id, dto, images);
  }
}
