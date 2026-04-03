import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserRequest } from './create-user.request';

export interface IUpdateUserRequest {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  about?: string;
  email?: string;
  phone?: string;
}

export class UpdateUserRequest
  extends PartialType(OmitType(CreateUserRequest, ['avatar']))
  implements IUpdateUserRequest {}
