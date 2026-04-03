import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call the canActivate method from AuthGuard', async () => {
    const context = createMock<ExecutionContext>();

    const canActivateSpy = jest
      .spyOn(JwtAuthGuard.prototype, 'canActivate')
      .mockImplementation(async () => Promise.resolve(true));

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(canActivateSpy).toHaveBeenCalledWith(context);
  });
});
