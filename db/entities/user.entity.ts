import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  avatar: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 32 })
  phone: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 32 })
  passwordHash: string;

  @OneToMany(() => PostEntity, (posts) => posts.user)
  posts: Array<PostEntity>;
}
