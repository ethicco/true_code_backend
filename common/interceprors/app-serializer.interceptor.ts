import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { Reflector } from '@nestjs/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EXCLUDE_FROM_SERIALIZATION_META_KEY } from '@/common/decorators';

interface AppSerializerInterceptorOptions extends ClassSerializerInterceptorOptions {
  excludePaths?: string[];
}

@Injectable()
export class AppSerializerInterceptor extends ClassSerializerInterceptor {
  private readonly options: AppSerializerInterceptorOptions;
  private readonly hasExcludePaths: boolean;

  constructor(reflector: Reflector, options?: AppSerializerInterceptorOptions) {
    super(reflector, { strategy: 'excludeAll', ...options });
    this.options = { strategy: 'excludeAll', ...options };
    this.hasExcludePaths = !!this.options.excludePaths?.length;
  }

  private isPrimitive(data: unknown): boolean {
    return (
      typeof data !== 'object' ||
      data === null ||
      (Array.isArray(data) && data.every((item) => typeof item !== 'object'))
    );
  }

  private shouldExcludeFromSerialization(context: ExecutionContext): boolean {
    const handler = context.getHandler();

    return (
      Reflect.getMetadata(EXCLUDE_FROM_SERIALIZATION_META_KEY, handler) || false
    );
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (this.hasExcludePaths && this.options.excludePaths?.length) {
      const request = ctx.switchToHttp().getRequest();
      const url = request.url;

      if (this.options.excludePaths.some((x) => url.startsWith(x))) {
        return next.handle();
      }
    }

    if (this.shouldExcludeFromSerialization(ctx)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (this.isPrimitive(data)) return data;

        const handler = ctx.getHandler();
        const serializeOptions = Reflect.getMetadata(
          CLASS_SERIALIZER_OPTIONS,
          handler,
        );
        if (!serializeOptions?.type) return data;

        const dtoClass = serializeOptions.type;
        const transformedData = plainToInstance(dtoClass, data);

        return instanceToPlain(transformedData, this.options);
      }),
    );
  }
}
