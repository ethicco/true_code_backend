import { BadRequestException, applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { isString } from 'class-validator';

const sortTransformer = (
  allowedKeys: string[],
  isStrings?: boolean,
): ((
  params: TransformFnParams,
) => string | Record<string, 'asc' | 'desc'> | null) => {
  return ({
    value,
  }: TransformFnParams): string | Record<string, 'asc' | 'desc'> | null => {
    if (!isString(value)) {
      throw new BadRequestException({
        message: 'Значение должно быть строкой например: "createdAt:desc"',
        field: 'sort',
      });
    }

    const result: Record<string, 'asc' | 'desc'> = {};
    const pairs = value.split(',');

    for (const pair of pairs) {
      const delimiterIdx = pair.lastIndexOf(':');
      const key = delimiterIdx > 0 ? pair.substring(0, delimiterIdx) : pair;
      const direction =
        delimiterIdx > 0 ? pair.substring(delimiterIdx + 1) : 'asc';

      if (!allowedKeys.includes(key)) {
        throw new BadRequestException({
          message: `Такой ключ не существует, проверьте правильность введеного значения: ${allowedKeys.join(', ')}`,
          field: 'sort',
        });
      }

      if (direction !== 'asc' && direction !== 'desc') {
        throw new BadRequestException({
          message:
            'Значение указано не верно выберете одно из следующих значений: asc, desc',
          field: 'sort',
        });
      }

      result[key] = direction;
    }

    if (isStrings) {
      return Object.keys(result).length ? value : null;
    } else {
      return Object.keys(result).length ? result : null;
    }
  };
};

export function SortTransform(
  allowedKeys: string[],
  isStrings: boolean = true,
): PropertyDecorator {
  return applyDecorators(
    Transform(sortTransformer(allowedKeys, isStrings), { toClassOnly: true }),
  );
}
