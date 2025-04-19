import { Request, Response } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const customClaims = async (req: Request, res: Response) => {
  const { role, uid, branch_id } = req.body;

  try {
    await auth.setCustomUserClaims(uid, { role, branch_id });
    res
      .status(HTTP_STATUS.OK)
      .json({
        message: `Role "${role}" & branch "${branch_id}" assigned to user ${uid}`,
      });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to set custom claims" });
  }
};
