import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFilesAfterEnv: ['jest-extended/all'],
  rootDir: '.',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  modulePathIgnorePatterns: ['dist', 'node_modules'],
  coveragePathIgnorePatterns: ['dist', 'node_modules'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
} satisfies JestConfigWithTsJest;
