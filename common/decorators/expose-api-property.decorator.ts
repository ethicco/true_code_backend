import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, ExposeOptions } from 'class-transformer';

export function ExposeApiProperty(
  apiPropertyOptions?: ApiPropertyOptions,
  exposeOptions?: ExposeOptions,
): PropertyDecorator {
  return applyDecorators(
    ApiProperty(apiPropertyOptions),
    Expose(exposeOptions),
  );
}
