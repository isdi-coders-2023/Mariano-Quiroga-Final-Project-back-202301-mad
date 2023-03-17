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
    'src/db/model/users.mongo.model.ts',
    'src/db/model/activities.mongo.model.ts',
    'config.ts',
    'src/router/user.router.ts',
  ],
};
