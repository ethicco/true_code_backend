import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const EXCLUDE_FROM_SERIALIZATION_META_KEY =
  'custom:exclude_from_serialization';

export const ExcludeFromSerialization = (): CustomDecorator<string> =>
  SetMetadata(EXCLUDE_FROM_SERIALIZATION_META_KEY, true);
