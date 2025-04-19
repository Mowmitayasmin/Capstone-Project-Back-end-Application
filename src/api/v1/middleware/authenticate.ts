import { Request, Response, NextFunction } from 'express'
import { AuthenticationError } from '../errors/errors'
import { DecodedIdToken } from 'firebase-admin/auth'
import { auth } from '../../../../config/firebaseConfig'

export const isAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     const token: string | undefined = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return next(new AuthenticationError('Unauthorized: No token provided', 'INVALID_TOKEN'))
    }
    try {
        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token)
        res.locals.id = decodedToken.uid;
        res.locals.role = decodedToken.role;
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            return next(new AuthenticationError(`Unauthorized: ${error.message}`, 'INVALID_TOKEN'))
        }
        return next(new AuthenticationError('Unauthorized: An unknown error occurred', 'INVALID_TOKEN'))
    }
}