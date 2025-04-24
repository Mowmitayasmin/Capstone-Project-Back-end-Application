import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as branchService from "../services/branches";
import { Branch } from "../models/branch";

/**
 * Retrieves all branches from the database and returns them in the response.
 *
 * This controller method uses the branchService to fetch all available branches
 * and sends them back to the client with a 200 OK status. If an error occurs,
 * it passes the error to the next middleware.
 *
 * @param req - Express request object (not used in this function).
 * @param res - Express response object used to return the list of branches.
 * @param next - Express next function for forwarding errors to error-handling middleware.
 *
 * @returns A JSON array of Branch objects with HTTP status 200 on success.
 */

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const branches: Branch[] = await branchService.getAllBranches();

    res.status(HTTP_STATUS.OK).json(branches);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new branch using the provided request body data.
 *
 * This controller method calls the branchService.createBranch function with
 * the request body to create a new branch in the system. On successful creation,
 * it returns a 201 Created response with a success message and the created branch.
 * If an error occurs, it passes the error to the next middleware.
 *
 * @param req - Express request object containing the new branch data in the body.
 * @param res - Express response object used to return the created branch and message.
 * @param next - Express next function for forwarding errors to error-handling middleware.
 *
 * @returns A JSON object with a success message and the created Branch entity.
 */

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = {
      ...req.body,
    };

    const branch: Branch = await branchService.createBranch(data);

    res.status(HTTP_STATUS.CREATED).json({
      message: "Branch created successfully",
      branch: branch,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the details of a specific branch by its ID.
 *
 * This controller method extracts the id parameter from the request,
 * validates its presence, and uses branchService.getById to fetch the branch.
 * If the branch exists, it returns the branch details with a 200 OK response.
 * If the ID is missing or the branch is not found, it returns the appropriate error response.
 * Any unexpected error is passed to the next middleware.
 *
 * @param req - Express request object containing the branch ID in the URL parameters.
 * @param res - Express response object used to return the branch data or error messages.
 * @param next - Express next function for forwarding unexpected errors to error-handling middleware.
 *
 * @returns A JSON object containing the branch details on success,
 * or an error message on failure.
 */

export const branchDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Branch id is required" });
    return;
  }

  try {
    const branch = await branchService.getById(id);
    if (!branch) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Branch not found" });
      return;
    }
    res.status(HTTP_STATUS.OK).json({
      success: true,
      branch: branch,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing branch with the provided data.
 *
 * This controller method retrieves the id from the request parameters and the updated
 * data from the request body, then calls branchService.updateBranch to apply the changes.
 * On success, it returns a 200 OK response with a success message and the updated branch data.
 * Any errors encountered are forwarded to the next middleware.
 *
 * @param req - Express request object containing the branch ID in params and update data in body.
 * @param res - Express response object used to return the updated branch and a success message.
 * @param next - Express next function for handling and forwarding errors.
 *
 * @returns A JSON object with a success message and the updated Branch entity.
 */

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const branch: Branch = await branchService.updateBranch(
      req.params.id,
      req.body
    );

    res.status(HTTP_STATUS.OK).json({
      message: "Branch Updated successfully",
      branch: branch,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a branch by its ID.
 *
 * This controller method retrieves the branch ID from the request parameters and
 * calls branchService.deleteBranch to remove the branch from the database.
 * On successful deletion, it returns a 200 OK response with a success message.
 * Any errors are passed to the next middleware.
 *
 * @param req - Express request object containing the branch ID in the URL parameters.
 * @param res - Express response object used to return a success message.
 * @param next - Express next function for forwarding any errors to the error-handling middleware.
 *
 * @returns A JSON object with a message indicating successful deletion.
 */

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      message: "Branch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
