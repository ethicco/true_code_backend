import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { SortTransform } from './sort-transform.decorator';

class TestDefaultDto {
  @SortTransform(['createdAt'])
  sort: Record<string, 'asc' | 'desc'>;
}

class TestDto {
  @SortTransform(['createdAt'], false)
  sort: Record<string, 'asc' | 'desc'>;
}

describe('SortOrderTransform', () => {
  it('should transform several keys with values', () => {
    const input = { sort: 'createdAt:asc' };
    const result = plainToInstance(TestDto, input);

    expect(result.sort).toEqual({
      createdAt: 'asc',
    });
  });

  it('should transform several keys with values', () => {
    const input = { sort: 'createdAt:asc' };
    const result = plainToInstance(TestDefaultDto, input);

    expect(result.sort).toEqual(input.sort);
  });

  it('should not transform several keys with values (not string)', () => {
    const input = { sort: 1 };

    expect(() => plainToInstance(TestDto, input)).toThrow(BadRequestException);
  });

  it('should not transform several keys not valid', () => {
    const input = { sort: 'created:asc' };

    expect(() => plainToInstance(TestDto, input)).toThrow(BadRequestException);
  });

  it('should not transform several keys with no valid values  ', () => {
    const input = { sort: 'createdAt:as' };

    expect(() => plainToInstance(TestDto, input)).toThrow(BadRequestException);
  });
});
