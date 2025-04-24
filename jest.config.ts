 // jest.config.js
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^firebase-admin/auth$': '<rootDir>/__mocks__/firebase-admin/auth.ts'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
  };