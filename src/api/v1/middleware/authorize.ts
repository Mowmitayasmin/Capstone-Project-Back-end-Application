
import { Request, Response, NextFunction } from 'express'
import { AuthorizationError } from "../errors/errors";
export interface AuthorizationOptions {
    hasRole: Array<"admin" | "manager" | "user"| 'officer'>;
    allowSameUser?: boolean;
}


export const isAuthorize = (opts: AuthorizationOptions): (req: Request, res: Response, next: NextFunction) => void => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role, uid } = res.locals;
        const userId: string = req.params.uid;

        
        if (opts.allowSameUser && userId && uid === userId) {
            return next();
        }

        if (!role) {
            return next(
                new AuthorizationError(
                    "No role found",
                    "NO_RULE_FOUND"
                )
            );
        }

        if (opts.hasRole.includes(role)) {
            return next();
        }

        return next(
            new AuthorizationError(
                "Insufficient role",
                "INSUFFICIENT_ROLE"
            )
        );
    };
}