import nodemailer from "nodemailer";
import { EmailRequest } from "../models/mailer";
import dotenv from "dotenv";
dotenv.config();

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
