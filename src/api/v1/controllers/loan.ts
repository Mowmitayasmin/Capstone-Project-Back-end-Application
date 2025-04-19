
import { Request, Response, NextFunction } from "express";
import * as loanService from "../services/loan";
import type { Loan } from "../models/loan";
import { HTTP_STATUS } from '../../../constants/httpConstants';


export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const items: Loan[] = await loanService.getAllLoans();

        res.status(HTTP_STATUS.OK).json(
            items
        );
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
        const data = {
            ...req.body,
            is_reviewed: 0,
            is_approved: 0
        }

        const item: Loan = await loanService.createLoan(data);

      res.status(HTTP_STATUS.CREATED).json(
            {
                message: 'Loan created successfully',
                loan: item
            }
        );
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

        const updated: Loan = await loanService.updateLoan(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            {
                message: 'Loan updated successfully',
                loan: updated
            }
        );
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

        const updated: Loan = await loanService.updateLoan(
            req.params.id,
           {
            is_reviewed: true
           }
        );

        res.status(HTTP_STATUS.OK).json(
            {
                message: 'Reviewd successfully',
                item: updated
            }
        );
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

        const updated: Loan = await loanService.updateLoan(
            req.params.id,
           {
            is_approved: true
           }
        );

        res.status(HTTP_STATUS.OK).json(
            {
                message: 'Approved successfully',
                item: updated
            }
        );
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
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Loan id is required' });
      return;
    }
  
    try {
      const loan = await loanService.getLoanById(id);
      if (!loan) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Loan not found' });
        return;
      }
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
            message: 'Loan deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
