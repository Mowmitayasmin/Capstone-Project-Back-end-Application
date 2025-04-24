import nodemailer from "nodemailer";
import { EmailRequest } from "../models/mailer";

/**
 * Sends an email using Gmail's SMTP service.
 * This function creates a transporter using the credentials from environment variables,
 * then sends an email to the provided recipient with the specified subject and message.
 *
 * @param {EmailRequest} param - An object containing the email details.
 * @param {string} param.email - The recipient's email address.
 * @param {string} param.subject - The subject of the email.
 * @param {string} param.text - The body text of the email.
 *
 * @returns {Promise<{ success: boolean | string, message: string }>} - A promise that resolves to an object indicating the success or failure of the email sending process.
 * @throws {Error} - Throws an error if there is an issue with sending the email.
 */

export const sendEmail = async ({ email, subject, text }: EmailRequest) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: "Email send successfully",
      messaage: info.response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
    };
  }
};
