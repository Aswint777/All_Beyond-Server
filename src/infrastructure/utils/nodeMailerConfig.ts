import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { response } from "express";

dotenv.config();

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (
  mailOptions: MailOptions
): Promise<{ success: boolean; response?: string }> => {
  try {
    console.log(response, "the response here in the config nodemailer");

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER, // Load from environment variables
        pass: process.env.EMAIL_PASS, // Use app password or credentials
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      ...mailOptions,
    });

    console.log("Email sent successfully:", info.response);
    return { success: true, response: info.response };
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return { success: false };
  }
};
