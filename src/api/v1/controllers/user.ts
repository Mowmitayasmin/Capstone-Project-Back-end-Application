import { Request, Response, NextFunction } from 'express'
import { UserRecord } from 'firebase-admin/auth';
import { auth } from "../../../../config/firebaseConfig";
import { clientAuth } from '../../../../config/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as userService from "../services/user";
import { User } from '../models/user';






export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const items: User[] = await userService.getAllUsers();

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
           
        }

        const item: User = await userService.createUser(data);

      res.status(201).json(
            {
                message: 'User created successfully',
                item: item
            }
        );
    } catch (error) {
        next(error);
    }
};
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    try {
    
        const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
        if (userCredential.user) {
         
            const idToken = await userCredential.user.getIdToken();
            res.status(HTTP_STATUS.OK).json({ idToken });
        } else {
            throw new Error("User is null");
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Failed to sign in" });
    }
};
export const userDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
  
    if (!id) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'User id is required' });
      return;
    }
  
    try {
      const user: UserRecord = await auth.getUser(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
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

        const updated: User = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.status(200).json(
            {
                message: 'Updated successfully',
                item: updated
            }
        );
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
        await userService.deleteUser(req.params.id);
        res.status(200).json({
            message: 'Loan deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
