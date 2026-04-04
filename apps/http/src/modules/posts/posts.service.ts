import fs from 'node:fs/promises';
import path from 'node:path';

import { settings } from '@/common/settings';
import { CreatePostRequest, PostResponse } from './dto';
import { PostsRepository } from './posts.repository';
import { PostsImageRepository } from './posts-image.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postsImageRepository: PostsImageRepository,
  ) {}

  async create(
    userId: string,
    dto: CreatePostRequest,
    images: Array<Express.Multer.File>,
  ): Promise<PostResponse> {
    const post = await this.postsRepository.create({ userId, text: dto.text });
    const userDir = path.join(
      process.cwd(),
      settings.UPLOAD_FOLDER,
      'posts',
      post.id,
    );
    await fs.mkdir(userDir, { recursive: true });

    const newFilePaths = await Promise.all(
      images.map(async (img) => {
        const newFilePath = path.join(userDir, img.filename);

        await fs.rename(img.path, newFilePath);

        return `posts/${post.id}/${img.filename}`;
      }),
    );

    await this.postsImageRepository.create({
      postId: post.id,
      images: newFilePaths,
    });

    const res = await this.postsRepository.getById(post.id);

    return {
      id: res.id,
      text: res.text,
      images: res.images.map((img) => img.image),
      createdAt: res.cratedAt,
    };
  }
}
