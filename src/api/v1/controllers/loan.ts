import { Request, Response, NextFunction } from "express";
import * as loanService from "../services/loan";
import type { Loan } from "../models/loan";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { sendEmail } from "./mailer";
import { auth } from "../../../../config/firebaseConfig";
import { UserRecord } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/auth";
import { WhereFilterOp } from "firebase-admin/firestore";

/**
 * Retrieves a list of loans with optional filtering parameters.
 *
 * This controller method supports dynamic filtering by priceMin, priceMax, user_id, 
 * branch_id, is_approved, and is_reviewed from the query string. 
 * It constructs a set of filters accordingly and passes them to the loan service.
 * The result is returned as a JSON response with status 200. 
 * Any errors during the process are forwarded to the error-handling middleware.
 *
 * @param req - Express request object containing optional query parameters:
 *  - priceMin (number): Minimum price filter (inclusive).
 *  - priceMax (number): Maximum price filter (inclusive).
 *  - user_id (string): Filter by user ID.
 *  - branch_id (string): Filter by branch ID.
 *  - is_approved (boolean): Filter by approval status.
 *  - is_reviewed (boolean): Filter by review status.
 *  - limit (number): Limit the number of returned items.
 * 
 * @param res - Express response object used to return the filtered loans.
 * @param next - Express next function for handling and forwarding errors.
 *
 * @returns A JSON array of loan items matching the filter criteria.
 */

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      priceMin,
      priceMax,
      limit,
      user_id,
      branch_id,
      is_approved,
      is_reviewed,
    } = req.query;

    const filters = [];

    if (priceMin) {
      filters.push({
        field: "price",
        operator: "<=" as WhereFilterOp,
        value: Number(priceMin),
      });
    }

    if (priceMax) {
      filters.push({
        field: "price",
        operator: ">=" as WhereFilterOp,
        value: Number(priceMax),
      });
    }

    if (user_id) {
      filters.push({
        field: "user_id",
        operator: "==" as WhereFilterOp,
        value: Number(user_id),
      });
    }
    if (branch_id) {
      filters.push({
        field: "branch_id",
        operator: "==" as WhereFilterOp,
        value: Number(branch_id),
      });
    }

    if (is_approved) {
      filters.push({
        field: "is_approved",
        operator: "==" as WhereFilterOp,
        value: Number(is_approved),
      });
    }

    if (is_reviewed) {
      filters.push({
        field: "is_reviewed",
        operator: "==" as WhereFilterOp,
        value: Number(is_reviewed),
      });
    }

    const queryOptions = {
      filters,

      limit: limit ? Number(limit) : undefined,
    };

    const items = await loanService.getAllLoans(queryOptions);

    res.status(HTTP_STATUS.OK).json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new loan application.
 *
 * This controller method performs the following:
 * - Extracts and verifies the Firebase auth token from the Authorization header.
 * - Retrieves the authenticated user's details.
 * - Attaches default values to the loan request (is_reviewed, is_approved, user_id, and branch_id from custom claims).
 * - Creates a new loan via the loanService.
 * - Sends an email notification to a predefined email address for review purposes.
 * - Returns a success response with the newly created loan data.
 *
 * @param req - Express request object containing the loan details in the body and auth token in the headers.
 * @param res - Express response object used to return the created loan and a success message.
 * @param next - Express next function used to forward errors to the error-handling middleware.
 *
 * @returns A JSON object with a message and the created loan item on success.
 */

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string | undefined =
      req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

    const user: UserRecord = await auth.getUser(decodedToken.uid);

    const data = {
      ...req.body,
      is_reviewed: 0,
      is_approved: 0,
      user_id: decodedToken.uid,
      branch_id: user?.customClaims?.branch_id,
    };

    const item: Loan = await loanService.createLoan(data);

    //  send mail
    if (user.email) {
      sendEmail({
        email: "meite@gmail.com",
        subject: "Loan Application",
        text: `A user has applied for a loan. Please review the application.`,
      });
    }

    res.status(HTTP_STATUS.CREATED).json({
      message: "Loan created successfully",
      loan: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing loan entry.
 *
 * This controller method:
 * - Accepts a loan ID as a route parameter.
 * - Accepts updated loan data from the request body.
 * - Calls the loanService.updateLoan method to update the loan record.
 * - Returns a success response with the updated loan data.
 *
 * @param req - Express request object containing the loan ID in params and update data in body.
 * @param res - Express response object used to return a success message and the updated loan.
 * @param next - Express next function used to forward any errors to the error-handling middleware.
 *
 * @returns A JSON object with a message and the updated loan object.
 */

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated: Loan = await loanService.updateLoan(req.params.id, req.body);

    res.status(HTTP_STATUS.OK).json({
      message: "Loan updated successfully",
      loan: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the review process of a loan application.
 * This function fetches the loan by its ID, updates its review to true, 
 * sends an email notification to the user, and returns the updated loan details.
 *
 * @param req - The request object containing the loan ID as a URL parameter.
 * @param res - The response object used to send the result of the review process.
 * @param next - The next function in the middleware chain to handle errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue fetching, updating, or emailing.
 */

export const review = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loan = await loanService.getById(req.params.id);
    const updated: Loan = await loanService.updateLoan(req.params.id, {
      is_reviewed: true,
    });
    const user: UserRecord = await auth.getUser(loan.data()?.user_id);
    //  send mail
    if (user.email) {
      sendEmail({
        email: user.email,
        subject: "Reviewed Loan Application",
        text: `Congratulation! Your loan is reviewed.`,
      });
    }
    res.status(HTTP_STATUS.OK).json({
      message: "Reviewd successfully",
      item: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the approval process of a loan application.
 * This function fetches the loan by its ID, updates its approve to true, 
 * sends an email notification to the user, and returns the updated loan details.
 *
 * @param req - The request object containing the loan ID as a URL parameter.
 * @param res - The response object used to send the result of the approval process.
 * @param next - The next function in the middleware chain to handle errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue fetching, updating, or emailing.
 */

export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loan = await loanService.getById(req.params.id);

    const updated: Loan = await loanService.updateLoan(req.params.id, {
      is_approved: true,
    });
    const user: UserRecord = await auth.getUser(loan.data()?.user_id);
    //  send mail
    if (user.email) {
      sendEmail({
        email: user.email,
        subject: "Approved Loan Application",
        text: `Congratulation! Your loan is approved.`,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Approved successfully",
      item: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the details of a specific loan based on its ID.
 * This function fetches the loan by its ID, and returns the loan details if found.
 * If the loan ID is not provided or an error occurs, it handles the failure appropriately.
 *
 * @param req - The request object containing the loan ID as a URL parameter.
 * @param res - The response object used to send the loan details or error message.
 * @param next - The next function in the middleware chain to handle errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue fetching the loan details.
 */

export const loanDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Loan id is required" });
    return;
  }

  try {
    const loan = await loanService.getById(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      loan: loan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the deletion of a loan application.
 * This function deletes a loan by its ID and returns a success message upon completion.
 * If an error occurs during the deletion process, it passes the error to the next middleware.
 *
 * @param req - The request object containing the loan ID as a URL parameter.
 * @param res - The response object used to send the result of the deletion process.
 * @param next - The next function in the middleware chain to handle errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue deleting the loan.
 */

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await loanService.deleteLoan(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      message: "Loan deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
