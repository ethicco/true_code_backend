import 'jest-extended';

declare global {
  type AnyObject = Record<string, unknown>;

  type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

  type SortObject<T = string> = Record<T, 'asc' | 'desc'>;
}

export {};
