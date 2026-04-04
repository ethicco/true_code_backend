import { CreatePostRequest } from './dto';
import { PostsRepository } from './posts.repository';

export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postsImageRepository: PostsRepository,
  ) {}

  async create(
    userId: string,
    dto: CreatePostRequest,
    images: Array<Express.Multer.File>,
  ) {
    const post = await this.postsRepository.create({ userId, ...dto });

    const imagesUrls = images.map((img) => img.filename);
  }
}
