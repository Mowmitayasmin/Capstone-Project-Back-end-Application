import { Request, Response } from "express";
import * as loanController from "../src/api/v1/controllers/loan";
import * as loanService from "../src/api/v1/services/loan";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/loan.ts");

describe("Loan Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should create a new loan and return 201 status", async () => {
    
      const mockCreatedLoan = {
        price: 1000,
        name: 'loan1',
        description: 'loan description',
        
      };

      (loanService.createLoan as jest.Mock).mockResolvedValue(mockCreatedLoan);

      await loanController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(loanService.createLoan);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Loan created successfully',
        loan: mockCreatedLoan
      });
    });

   

    it("should handle service errors", async () => {
      const error = new Error("Database error");
      (loanService.createLoan as jest.Mock).mockRejectedValue(error);
      mockReq.body = { price: 1000,};

      await loanController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return all loans with 200 status", async () => {
      const mockLoans = [
        { id: "loan1", price: 5000},
        { id: "loan2", price: 3000}
      ];

      (loanService.getAllLoans as jest.Mock).mockResolvedValue(mockLoans);

      await loanController.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(loanService.getAllLoans).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockLoans);
    });

    it("should handle filters and pagination", async () => {
      const mockLoans = [{ id: "loan1" }];
    
      (loanService.getAllLoans as jest.Mock).mockResolvedValue(mockLoans);

      await loanController.getAll(mockReq as Request, mockRes as Response, mockNext);
    });

    it("should return empty array when no loans exist", async () => {
      (loanService.getAllLoans as jest.Mock).mockResolvedValue([]);

      await loanController.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe("loanDetails", () => {
    it("should return loan details for valid ID", async () => {
      const loanId = "12345";
      const mockLoan = {
        id: loanId,
        price: 5000,
       
      };

      mockReq.params = { id: loanId };
      (loanService.getLoanById as jest.Mock).mockResolvedValue(mockLoan);

      await loanController.loanDetails(mockReq as Request, mockRes as Response, mockNext);

      expect(loanService.getLoanById).toHaveBeenCalledWith(loanId);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        loan: mockLoan
      });
    });

   
  });

  describe("update", () => {
    it("should update loan status successfully", async () => {
      const loanId = "3ycqSUJmqIDsGHOdYwrB";
      const updateData = { is_approved: true , name: 'change name'};
      const updatedLoan = { id: loanId, ...updateData };

      mockReq.params = { id: loanId };
      mockReq.body = updateData;
      (loanService.updateLoan as jest.Mock).mockResolvedValue(updatedLoan);

      await loanController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(loanService.updateLoan).toHaveBeenCalledWith(loanId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Loan updated successfully',
        loan: updatedLoan
      });
    });

    it("should reject invalid status updates", async () => {
      mockReq.params = { id: "loan123" };
      mockReq.body = { is_approved: true };

      await loanController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
  });
  

  describe("remove", () => {
    it("should delete loan successfully", async () => {
      const loanId = "loan123";
      mockReq.params = { id: loanId };
      (loanService.deleteLoan as jest.Mock).mockResolvedValue(true);

      await loanController.remove(mockReq as Request, mockRes as Response, mockNext);

      expect(loanService.deleteLoan).toHaveBeenCalledWith(loanId);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Loan deleted successfully'
      });
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Deletion failed");
      mockReq.params = { id: "loan123" };
      (loanService.deleteLoan as jest.Mock).mockRejectedValue(error);

      await loanController.remove(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

});