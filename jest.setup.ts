// jest.setup.ts
import { jest } from '@jest/globals';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  auth: jest.fn(() => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUsers: jest.fn(),
    deleteUser: jest.fn()
  }))
}));