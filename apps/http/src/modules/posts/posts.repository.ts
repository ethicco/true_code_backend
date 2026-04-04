import { PostEntity } from '@/db/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICretePostRequest, IPostListRequest, IUpdatePostRequest } from './dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  create(request: ICretePostRequest): Promise<PostEntity> {
    return this.postsRepository.save(request);
  }

  getById(id: string): Promise<PostEntity> {
    return this.postsRepository.findOneOrFail({
      where: { id },
      relations: { images: true },
    });
  }

  getList(request: IPostListRequest): Promise<[PostEntity[], number]> {
    const { userId, perPage, page, sort } = request;

    return this.postsRepository.findAndCount({
      where: userId ? { userId } : undefined,
      take: perPage,
      skip: (page - 1) * perPage,
      order: sort,
      relations: { images: true },
    });
  }

  async update(id: string, dto: IUpdatePostRequest): Promise<PostEntity> {
    const post = await this.postsRepository.findOneOrFail({ where: { id } });

    PostEntity.merge(post, { ...dto });

    return this.postsRepository.save(post);
  }

  async delete(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOneOrFail({
      where: { id },
      relations: { images: true },
    });

    return post.remove();
  }
}
