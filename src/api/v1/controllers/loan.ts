import { Request, Response, NextFunction } from "express";
import * as loanService from "../services/loan";
import type { Loan } from "../models/loan";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { sendEmail } from "./mailer";
import { auth } from "../../../../config/firebaseConfig";
import { UserRecord } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/auth";
import { WhereFilterOp } from "firebase-admin/firestore";

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
