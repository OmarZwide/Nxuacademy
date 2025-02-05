import nodemailer from "nodemailer";
import crypto from "crypto";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email for NXU Academy",
    html: `
      <h1>Welcome to NXU Academy</h1>
      <p>Thank you for joining our waitlist. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 6px;">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not sign up for NXU Academy, please ignore this email.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
