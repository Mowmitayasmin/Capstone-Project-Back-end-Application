import { Request, Response } from "express";
import * as userController from "../src/api/v1/controllers/user";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { auth } from "../config/firebaseConfig";

// Mock the entire firebase-admin module
jest.mock("firebase-admin/auth");

describe("User Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();

    // Reset all mocks
    (auth.createUser as jest.Mock).mockReset();
    (auth.updateUser as jest.Mock).mockReset();
    (auth.getUsers as jest.Mock).mockReset();
    (auth.deleteUser as jest.Mock).mockReset();
  });

  describe("create", () => {
    it("should create a new user and return 201 status", async () => {
      const mockUser = {
        uid: "1",
        email: "test@gmail.com",
        name: "user 1",
      };

      (auth.createUser as jest.Mock).mockResolvedValue(mockUser);

      mockReq.body = {
        name: "user 1",
        email: "test@gmail.com",
        password: "123456",
      };

      await userController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(auth.createUser).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "123456",
        name: "user 1",
      });
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User created successfully",
        item: mockUser,
      });
    });

    it("should handle service errors", async () => {
      const error = new Error("Database error");
      (auth.createUser as jest.Mock).mockRejectedValue(error);
      mockReq.body = {
        email: "test@gmail.com",
        password: "123456",
      };

      await userController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const userId = "3ycqSUJmqIDsGHOdYwrB";
      const updateData = { name: "change name" };
      const updatedUser = {
        uid: userId,
        name: "change name",
      };

      mockReq.params = { id: userId };
      mockReq.body = updateData;
      (auth.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await userController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(auth.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Updated successfully",
        item: updatedUser,
      });
    });

    it("should handle invalid updates", async () => {
      mockReq.params = { id: "invalid-id" };
      mockReq.body = { invalidField: "value" };

      await userController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });

  describe("getAll", () => {
    it("should return all users with 200 status", async () => {
      const mockUsers = [
        { uid: "user1", email: "user1@test.com", name: "User One" },
        { uid: "user2", email: "user2@test.com", name: "User Two" },
      ];

      (auth.getUsers as jest.Mock).mockResolvedValue({ users: mockUsers });

      await userController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
    });
  });

  describe("remove", () => {
    it("should delete user successfully", async () => {
      const userId = "123";
      mockReq.params = { id: userId };
      (auth.deleteUser as jest.Mock).mockResolvedValue(true);

      await userController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(auth.deleteUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Deletion failed");
      mockReq.params = { id: "123" };
      (auth.deleteUser as jest.Mock).mockRejectedValue(error);

      await userController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
