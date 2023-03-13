/** @type {import('ts-jest').JestConfigWithTsJest} */ export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'src/entities',
    'src/app.ts',
    'src/index.ts',
    'src/routes.ts',
    'router',
    'db',
    'users.monogo.model.ts',
    'config.ts',
  ],
};
