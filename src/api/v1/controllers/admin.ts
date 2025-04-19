import { Request, Response } from 'express'
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from '../../../constants/httpConstants';

 export const customClaims = async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { role } = req.body;
    try {
        await auth.setCustomUserClaims(uid, { role });
        res.status(HTTP_STATUS.OK).json({ message: `Role "${role}" assigned to user ${uid}` });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Failed to set custom claims" });
    }
}

