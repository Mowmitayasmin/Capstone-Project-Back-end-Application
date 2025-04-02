import { Request, Response, NextFunction } from "express";
import { ErrorClass, ServiceError } from "../errors/errors";
import { HTTP_STATUS } from "constant/httpConstants";

const customErrorHandler = (
    error: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!error) {

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            new ServiceError("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    if (error instanceof ErrorClass) {
        res.status(HTTP_STATUS.UNKNOWN_ERROR_CODE).json(
            {
                message: error.message,
                code: error.code
            }
        );
    } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            {
                message: error.message,
                code: 'INTERNAL_SERVER_ERROR'
            }
        );
    }
};

export default customErrorHandler;
