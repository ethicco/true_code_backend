import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { lastValueFrom, of } from 'rxjs';

import {
  EXCLUDE_FROM_SERIALIZATION_META_KEY,
  ExcludeFromSerialization,
} from '@/common/decorators';

import { AppSerializerInterceptor } from './app-serializer.interceptor';

class TestDto {
  id: string;
  name: string;
}

describe('AppSerializerInterceptor', () => {
  let interceptor: AppSerializerInterceptor;
  let mockReflector: DeepMocked<Reflector>;
  let mockExecutionContext: DeepMocked<ExecutionContext>;
  let mockCallHandler: DeepMocked<CallHandler<unknown>>;

  class TestClass {
    @ExcludeFromSerialization()
    excludedTestMethod(): { lol: string } {
      return { lol: 'kek' };
    }

    testMethod(): { lol: string } {
      return { lol: 'kek' };
    }
  }

  beforeEach(() => {
    mockReflector = createMock<Reflector>();
    mockExecutionContext = createMock<ExecutionContext>();
    mockCallHandler = createMock<CallHandler<unknown>>();

    interceptor = new AppSerializerInterceptor(mockReflector, {
      excludePaths: ['/exclude'],
    });
  });

  describe('isPrimitive method', () => {
    it('should return true for primitive values', () => {
      expect(interceptor['isPrimitive'](42)).toBe(true);
      expect(interceptor['isPrimitive']('primitive')).toBe(true);
      expect(interceptor['isPrimitive'](true)).toBe(true);
      expect(interceptor['isPrimitive'](null)).toBe(true);
      expect(interceptor['isPrimitive'](undefined)).toBe(true);
    });

    it('should return false for objects', () => {
      expect(interceptor['isPrimitive']({})).toBe(false);
      expect(interceptor['isPrimitive']({ lol: 'kek' })).toBe(false);
    });

    it('should return false for arrays of objects', () => {
      expect(interceptor['isPrimitive']([{}])).toBe(false);
      expect(interceptor['isPrimitive']([{ lol: 'kek' }])).toBe(false);
    });

    it('should return true for arrays of primitives only', () => {
      expect(interceptor['isPrimitive']([1, 2, 3])).toBe(true);
      expect(interceptor['isPrimitive'](['a', 'b', 'c'])).toBe(true);
      expect(interceptor['isPrimitive']([true, false])).toBe(true);
    });

    it('should return false for arrays of mixed types', () => {
      expect(interceptor['isPrimitive']([1, 'a', {}])).toBe(false);
      expect(interceptor['isPrimitive']([true, null, { lol: 'kek' }])).toBe(
        false,
      );
    });
  });

  describe('shouldExcludeFromSerialization method', () => {
    it('should return true if handler has ExcludeFromSerialization decorator', () => {
      const testInstance = new TestClass();
      mockExecutionContext.getHandler.mockReturnValue(
        testInstance.excludedTestMethod,
      );
      mockReflector.get.mockReturnValue(true);

      const result =
        interceptor['shouldExcludeFromSerialization'](mockExecutionContext);
      expect(result).toBe(true);

      const metaKey = Reflect.getMetadata(
        EXCLUDE_FROM_SERIALIZATION_META_KEY,
        testInstance.excludedTestMethod,
      );
      expect(metaKey).toBe(true);
    });

    it('should return false if handler has no ExcludeFromSerialization decorator', () => {
      const testInstance = new TestClass();
      mockExecutionContext.getHandler.mockReturnValue(testInstance.testMethod);
      mockReflector.get.mockReturnValue(false);

      const result =
        interceptor['shouldExcludeFromSerialization'](mockExecutionContext);
      expect(result).toBe(false);

      const metaKey = Reflect.getMetadata(
        EXCLUDE_FROM_SERIALIZATION_META_KEY,
        testInstance.testMethod,
      );

      expect(metaKey).toBe(undefined);
    });
  });

  describe('intercept method', () => {
    it('should skip serialization for excluded paths', async () => {
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue({ url: '/exclude' }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
      mockCallHandler.handle.mockReturnValue(of({}));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({});
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });

    it('should skip serialization if shouldExcludeFromSerialization returns true', async () => {
      mockReflector.get.mockReturnValue(true);
      mockCallHandler.handle.mockReturnValue(of({}));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({});
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });

    it('should serialize data if no exclusion rules apply', async () => {
      mockReflector.get.mockReturnValue(false);
      mockCallHandler.handle.mockReturnValue(of({ id: '1', name: 'Test' }));

      mockReflector.get.mockReturnValueOnce({ type: TestDto });

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual(
        instanceToPlain(plainToInstance(TestDto, { id: '1', name: 'Test' })),
      );
    });

    it('should return primitive data as is', async () => {
      mockReflector.get.mockReturnValue(false);
      mockCallHandler.handle.mockReturnValue(of('primitive'));

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toBe('primitive');
    });

    it('should return original data if serializeOptions.type is not defined', async () => {
      mockReflector.get.mockReturnValue(false);
      mockCallHandler.handle.mockReturnValue(of({ id: '1', name: 'Test' }));

      mockReflector.get.mockReturnValueOnce({});

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual({ id: '1', name: 'Test' });
    });

    it('should serialize data if excludePaths is not set', async () => {
      interceptor = new AppSerializerInterceptor(mockReflector);

      mockReflector.get.mockReturnValueOnce(false);
      mockReflector.get.mockReturnValueOnce({ type: TestDto });

      mockCallHandler.handle.mockReturnValue(
        of({ id: '2', name: 'No Exclude Paths' }),
      );

      const result = await lastValueFrom(
        interceptor.intercept(mockExecutionContext, mockCallHandler),
      );

      expect(result).toEqual(
        instanceToPlain(
          plainToInstance(TestDto, { id: '2', name: 'No Exclude Paths' }),
        ),
      );
    });
  });
});
