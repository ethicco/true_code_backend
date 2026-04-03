import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { JwtAuthRefreshTokenGuard } from './jwt-auth-refresh-token.guard';

describe('JwtAuthRefreshTokenGuard', () => {
  let guard: JwtAuthRefreshTokenGuard;

  beforeEach(() => {
    guard = new JwtAuthRefreshTokenGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call the canActivate method from AuthGuard', async () => {
    const context = createMock<ExecutionContext>();

    const canActivateSpy = jest
      .spyOn(JwtAuthRefreshTokenGuard.prototype, 'canActivate')
      .mockImplementation(async () => Promise.resolve(true));

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(canActivateSpy).toHaveBeenCalledWith(context);
  });
});
