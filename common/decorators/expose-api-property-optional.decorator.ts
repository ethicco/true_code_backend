import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, ExposeOptions } from 'class-transformer';

export function ExposeApiPropertyOptional(
  apiPropertyOptions?: ApiPropertyOptions,
  exposeOptions?: ExposeOptions,
): PropertyDecorator {
  return applyDecorators(
    ApiPropertyOptional(apiPropertyOptions),
    Expose(exposeOptions),
  );
}
