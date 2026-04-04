import { ExposeApiProperty } from './expose-api-property.decorator';

describe('ExposeApiProperty', () => {
  it('should apply decorators without options', () => {
    const decorator = ExposeApiProperty();
    expect(typeof decorator).toBe('function');
  });

  it('should apply decorators with options', () => {
    const decorator = ExposeApiProperty(
      { description: 'test' },
      { name: 'custom' },
    );
    expect(typeof decorator).toBe('function');
  });
});
