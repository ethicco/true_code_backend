import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards';
import {
  CreatePostRequest,
  PostListRequest,
  PostListResponse,
  PostResponse,
  UpdatePostRequest,
} from './dto';
import { PostsService } from './posts.service';
import { User } from '@/common/decorators';
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

  @ApiOperation({
    description: 'Получение списка постов.',
    summary: 'Получение списка постов.',
  })
  @ApiOkResponse({ type: PostListResponse })
  @SerializeOptions({ type: PostListResponse })
  @Get('')
  getList(@Query() dto: PostListRequest): Promise<PostListResponse> {
    return this.postsService.getList(dto);
  }

  @ApiOperation({
    description: 'Получение поста по ID.',
    summary: 'Получение поста по ID.',
  })
  @ApiOkResponse({ type: PostResponse })
  @SerializeOptions({ type: PostResponse })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<PostResponse> {
    return this.postsService.getById(id);
  }

  @ApiOperation({
    description: 'Обновление поста.',
    summary: 'Обновление поста.',
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
  @ApiOkResponse({ type: PostResponse })
  @SerializeOptions({ type: PostResponse })
  @Put(':id')
  update(
    @User('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostRequest,
    @UploadedFiles() { images }: { images: Array<Express.Multer.File> },
  ): Promise<PostResponse> {
    return this.postsService.update(userId, id, dto, images);
  }

  @ApiOperation({
    description: 'Удаление поста.',
    summary: 'Удаление поста.',
  })
  @ApiOkResponse({ type: PostResponse })
  @SerializeOptions({ type: PostResponse })
  @Delete(':id')
  delete(
    @User('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostResponse> {
    return this.postsService.delete(userId, id);
  }
}
