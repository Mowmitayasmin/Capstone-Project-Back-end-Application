import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";

import { auth } from "../../../../config/firebaseConfig";
import { clientAuth } from "../../../../config/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { sendEmail } from "./mailer";

/**
 * Retrieves a list of all users.
 * This function fetches the list of users using the auth.listUsers() method and returns the result.
 * If an error occurs during the process, it is passed to the next middleware for handling.
 *
 * @param req - The request object, which may contain query parameters for filtering or pagination (if applicable).
 * @param res - The response object used to send the list of users or an error message.
 * @param next - The next function in the middleware chain to handle any errors.
 *
 * @returns {Promise<void>} - A promise that resolves to void, as the response is sent directly.
 * @throws {Error} - Throws an error if there is an issue fetching the user list.
 */

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await auth.listUsers();

    res.status(HTTP_STATUS.OK).json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new user in Firebase Authentication.
 * Uses the request body to create a new user and sends a confirmation email on success.
 *
 * @param req - Express request object containing user data in the body.
 * @param res - Express response object used to return success message and created user info.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Resolves when the user is created and email is sent.
 * @throws {Error} - If user creation or email sending fails.
 */

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = {
      ...req.body,
    };

    const item = await auth.createUser(data);
    sendEmail({
            email: data.email,
            subject: "Registration confirmation",
            text: 'Congratulation! Account successfully created',
          });

    res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
      item: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logs in a user using Firebase client authentication.
 * Uses the email and password from the request body and returns a valid ID token on success.
 *
 * @param req - Express request object containing `email` and `password` in the body.
 * @param res - Express response object used to return the Firebase ID token.
 * @param next - Express next middleware function (not used in this function).
 *
 * @returns {Promise<void>} - Resolves with the ID token or error message.
 * @throws {Error} - If sign-in fails or user credentials are invalid.
 */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    if (userCredential.user) {
      const idToken = await userCredential.user.getIdToken();
      res.status(HTTP_STATUS.OK).json({ idToken });
    } else {
      throw new Error("User is null");
    }
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to sign in" });
  }
};

/**
 * Retrieves detailed information about a specific user by user ID.
 * Responds with the user’s data if found, otherwise handles errors.
 *
 * @param req - Express request object with `id` as a route parameter.
 * @param res - Express response object used to return user details.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Resolves with user details or error message.
 * @throws {Error} - If the user is not found or Firebase retrieval fails.
 */

export const userDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "User id is required" });
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

/**
 * Updates user information in Firebase Authentication based on user ID.
 * Accepts new user data in the request body.
 *
 * @param req - Express request object with `id` param and updated user data in the body.
 * @param res - Express response object used to return success message and updated data.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Resolves when the user is updated successfully.
 * @throws {Error} - If updating the user fails.
 */

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await auth.updateUser(req.params.id, req.body);

    res.status(HTTP_STATUS.OK).json({
      message: "Updated successfully",
      item: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user from Firebase Authentication based on user ID.
 *
 * @param req - Express request object with `id` param indicating which user to delete.
 * @param res - Express response object used to return success confirmation.
 * @param next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Resolves when the user is deleted successfully.
 * @throws {Error} - If user deletion fails.
 */

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await auth.deleteUser(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
