import { ExposeApiPropertyOptional } from './expose-api-property-optional.decorator';

describe('ExposeApiPropertyOptional', () => {
  it('should return a decorator function without options', () => {
    const decorator = ExposeApiPropertyOptional();
    expect(typeof decorator).toBe('function');
  });

  it('should return a decorator function with options', () => {
    const decorator = ExposeApiPropertyOptional(
      { description: 'optional field' },
      { name: 'custom' },
    );
    expect(typeof decorator).toBe('function');
  });
});
