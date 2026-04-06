import fs from 'node:fs/promises';
import path from 'node:path';

import { settings } from '@/common/settings';
import {
  CreatePostRequest,
  PostListRequest,
  PostListResponse,
  PostResponse,
  UpdatePostRequest,
} from './dto';
import { PostsRepository } from './posts.repository';
import { PostsImageRepository } from './posts-image.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';

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
    const postDir = path.join(
      process.cwd(),
      settings.UPLOAD_FOLDER,
      'posts',
      post.id,
    );
    await fs.mkdir(postDir, { recursive: true });

    const newFilePaths = await Promise.all(
      images.map(async (img) => {
        const newFilePath = path.join(postDir, img.filename);

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
      createdAt: res.createdAt,
      userId: res.userId,
    };
  }

  async getList(dto: PostListRequest): Promise<PostListResponse> {
    const [data, totalCount] = await this.postsRepository.getList(dto);

    return {
      data: data.map(({ images, ...item }) => ({
        ...item,
        images: images.map((img) => img.image),
      })),
      meta: {
        page: dto.page,
        perPage: dto.perPage,
        totalCount,
      },
    };
  }

  async getById(id: string): Promise<PostResponse> {
    const { images, ...res } = await this.postsRepository.getById(id);

    return { ...res, images: images.map((img) => img.image) };
  }

  async update(
    userId: string,
    id: string,
    dto: UpdatePostRequest,
    images: Array<Express.Multer.File> = [],
  ): Promise<PostResponse> {
    const { text, imagesUrls } = dto;

    const post = await this.postsRepository.getById(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('The post does not belong to this user');
    }

    const removedImage: Array<{ id: string; image: string }> = [];

    post.images.forEach(({ id, image }) => {
      if (!imagesUrls?.includes(image)) {
        removedImage.push({ id, image });
      }
    });

    const postDir = path.join(
      process.cwd(),
      settings.UPLOAD_FOLDER,
      'posts',
      post.id,
    );

    await Promise.all(
      removedImage.map(async ({ id, image }) => {
        await fs.rm(path.join(process.cwd(), settings.UPLOAD_FOLDER, image), {
          force: true,
        });

        await this.postsImageRepository.delete(id);
      }),
    );

    const newFilePaths = await Promise.all(
      images.map(async (img) => {
        const newFilePath = path.join(postDir, img.filename);

        await fs.rename(img.path, newFilePath);

        return `posts/${post.id}/${img.filename}`;
      }),
    );

    await Promise.all([
      this.postsImageRepository.create({
        postId: post.id,
        images: newFilePaths,
      }),
      this.postsRepository.update(post.id, { text }),
    ]);

    const res = await this.postsRepository.getById(post.id);

    return {
      id: res.id,
      text: res.text,
      images: res.images.map((img) => img.image),
      createdAt: res.createdAt,
      userId: res.userId,
    };
  }

  async delete(userId: string, id: string): Promise<PostResponse> {
    const post = await this.postsRepository.getById(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('The post does not belong to this user');
    }

    await fs.rm(
      path.join(process.cwd(), settings.UPLOAD_FOLDER, 'posts', `${post.id}`),
      {
        force: true,
        recursive: true,
      },
    );

    const { images, ...res } = await this.postsRepository.delete(id);

    return {
      ...res,
      images: images.map((img) => img.image),
    };
  }
}
