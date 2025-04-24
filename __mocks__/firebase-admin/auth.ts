// __mocks__/firebase-admin/auth.ts
export const getAuth = jest.fn(() => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUsers: jest.fn(),
    deleteUser: jest.fn(),
    // Add other auth methods you use
  }));