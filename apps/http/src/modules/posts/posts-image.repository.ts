import { PostImageEntity } from '@/db/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreatePostImageRequest, IUpdatePostImageRequest } from './dto';

@Injectable()
export class PostsImageRepository {
  constructor(
    @InjectRepository(PostImageEntity)
    private readonly postsImageRepository: Repository<PostImageEntity>,
  ) {}

  create(request: ICreatePostImageRequest): Promise<Array<PostImageEntity>> {
    const { postId, images } = request;

    const imagesSave = images.map((img) => ({
      image: img,
      postId,
    }));

    return this.postsImageRepository.save(imagesSave);
  }

  getById(id: string): Promise<PostImageEntity> {
    return this.postsImageRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    dto: IUpdatePostImageRequest,
  ): Promise<PostImageEntity> {
    const postImage = await this.postsImageRepository.findOneOrFail({
      where: { id },
    });

    PostImageEntity.merge(postImage, { ...dto });

    return this.postsImageRepository.save(postImage);
  }

  async delete(id: string): Promise<PostImageEntity> {
    const postImage = await this.postsImageRepository.findOneOrFail({
      where: { id },
    });

    return postImage.remove();
  }
}
