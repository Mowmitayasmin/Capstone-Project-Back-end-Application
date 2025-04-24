import { Request, Response } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Assigns custom claims (role and branch ID) to a Firebase Auth user.
 *
 * This function is typically used to set authorization roles and contextual data (like branch ID)
 * for a specific user in Firebase using custom claims.
 *
 * @param req - Express request object containing uid, role, and branch_id in the body.
 * @param res - Express response object used to return the result of the operation.
 *
 * @returns A JSON response indicating success or failure.
 *
 * @example
 * POST /api/v1/admin/set-custom-claims
 * {
 *   "uid": "abc123",
 *   "role": "admin",
 *   "branch_id": "branch001"
 * }
 */

export const customClaims = async (req: Request, res: Response) => {
  const { role, uid, branch_id } = req.body;

  try {
    await auth.setCustomUserClaims(uid, { role, branch_id });
    res.status(HTTP_STATUS.OK).json({
      message: `Role "${role}" & branch "${branch_id}" assigned to user ${uid}`,
    });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to set custom claims" });
  }
};
