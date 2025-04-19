import { Request, Response, NextFunction } from "express";
import * as branchController from "../src/api/v1/controllers/branch";
import * as branchService from "../src/api/v1/services/branches";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/branches.ts");

describe("Branch Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should create a new branch and return 201 status", async () => {
      // Test data
      const newBranchData = {
        name: "Main Branch",
        address: "123 Main St, City, Country"
      };

      const mockCreatedBranch = {
        id: "1",
        ...newBranchData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock service
      (branchService.createBranch as jest.Mock).mockResolvedValue(mockCreatedBranch);
      mockReq.body = newBranchData;

      // Execute
      await branchController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Verify
      expect(branchService.createBranch).toHaveBeenCalledWith(newBranchData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Branch created successfully',
        branch: mockCreatedBranch
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when service throws", async () => {
      const error = new Error("Database error");
      (branchService.createBranch as jest.Mock).mockRejectedValue(error);
      mockReq.body = { name: "Test Branch" };

      await branchController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });


  });
  describe("getAll", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
      jest.clearAllMocks();
      mockReq = {};
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockNext = jest.fn();
    });

    it("should return all branches with 200 status", async () => {
      // Mock data
      const mockBranches = [
        {
          id: "1",
          name: "Main Branch",
          address: "123 Main St",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: "2",
          name: "Second Branch",
          address: "456 Oak Ave",
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      // Mock service response
      (branchService.getAllBranches as jest.Mock).mockResolvedValue(mockBranches);

      // Call controller method
      await branchController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assertions
      expect(branchService.getAllBranches).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockBranches);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return empty array when no branches exist", async () => {
      // Mock empty response
      (branchService.getAllBranches as jest.Mock).mockResolvedValue([]);

      await branchController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it("should call next with error when service fails", async () => {
      const mockError = new Error("Database error");
      (branchService.getAllBranches as jest.Mock).mockRejectedValue(mockError);

      await branchController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

  });
  describe("branchDetails", () => {
    it("should return 400 if no ID is provided", async () => {
      mockReq.params = {};

      await branchController.branchDetails(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Branch id is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if branch not found", async () => {
      const branchId = "1";
      mockReq.params = { id: branchId };
      (branchService.getBranchById as jest.Mock).mockResolvedValue(null);

      await branchController.branchDetails(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(branchService.getBranchById).toHaveBeenCalledWith(Number(branchId));
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Branch not found'
      });
    });

    it("should return branch details if found", async () => {
      const branchId = "1";
      const mockBranch = {
        id: 1,
        name: "Main Branch",
        address: "123 Main St"
      };
      mockReq.params = { id: branchId };
      (branchService.getBranchById as jest.Mock).mockResolvedValue(mockBranch);

      await branchController.branchDetails(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        branch: mockBranch
      });
    });

    it("should call next with error if service throws", async () => {
      const branchId = "1";
      const mockError = new Error("Database error");
      mockReq.params = { id: branchId };
      (branchService.getBranchById as jest.Mock).mockRejectedValue(mockError);

      await branchController.branchDetails(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("update", () => {
    it("should update branch and return success response", async () => {
      const branchId = "1";
      const updateData = {
        name: "Updated Branch",
        address: "456 New St"
      };
      const updatedBranch = {
        id: 1,
        ...updateData
      };
      mockReq.params = { id: branchId };
      mockReq.body = updateData;
      (branchService.updateBranch as jest.Mock).mockResolvedValue(updatedBranch);

      await branchController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(branchService.updateBranch).toHaveBeenCalledWith(
        branchId,
        updateData
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Branch Updated successfully',
        branch: updatedBranch
      });
    });

    it("should call next with error if update fails", async () => {
      const branchId = "1";
      const mockError = new Error("Update failed");
      mockReq.params = { id: branchId };
      mockReq.body = { name: "Test" };
      (branchService.updateBranch as jest.Mock).mockRejectedValue(mockError);

      await branchController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("remove", () => {
    it("should delete branch and return success message", async () => {
      const branchId = "1";
      mockReq.params = { id: branchId };
      (branchService.deleteBranch as jest.Mock).mockResolvedValue(undefined);

      await branchController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(branchService.deleteBranch).toHaveBeenCalledWith(branchId);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Branch deleted successfully'
      });
    });

    it("should call next with error if deletion fails", async () => {
      const branchId = "1";
      const mockError = new Error("Deletion failed");
      mockReq.params = { id: branchId };
      (branchService.deleteBranch as jest.Mock).mockRejectedValue(mockError);

      await branchController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it("should handle string ID parameter", async () => {
      const branchId = "abc123"; // Non-numeric ID
      mockReq.params = { id: branchId };
      (branchService.deleteBranch as jest.Mock).mockResolvedValue(undefined);

      await branchController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(branchService.deleteBranch).toHaveBeenCalledWith(branchId);
    });
  });
});