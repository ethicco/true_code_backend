import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { RefreshTokenStrategy } from './refresh-token.strategy';
import { JwtPayload } from './types';

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_AUTH_REFRESH_SECRET') {
                return 'test-secret';
              }
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should have the correct secret key', () => {
    const secretKey = configService.get('JWT_AUTH_REFRESH_SECRET');
    expect(secretKey).toBe('test-secret');
  });

  describe('validate', () => {
    it('should validate and return the payload', () => {
      const payload: JwtPayload = {
        sub: '123',
        avatar: 'avatar.jpg',
        firstName: 'John',
        lastName: 'Doe',
        about: 'About me',
        email: 'test@example.com',
        phone: '+1234567890',
        iat: 1616178476,
        exp: 1616182076,
      };

      const validatedPayload = strategy.validate(payload);

      expect(validatedPayload).toEqual({
        id: '123',
        avatar: 'avatar.jpg',
        firstName: 'John',
        lastName: 'Doe',
        about: 'About me',
        email: 'test@example.com',
        phone: '+1234567890',
        iat: 1616178476,
        exp: 1616182076,
      });
    });
  });
});
