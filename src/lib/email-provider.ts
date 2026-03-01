import type { NodemailerConfig } from "next-auth/providers/nodemailer";

/**
 * Nodemailer configuration for NextAuth.
 *
 * For development: Set up Ethereal test credentials manually at https://ethereal.email
 * and add them to your .env file. Ethereal captures emails without sending them.
 *
 * For production: Use real SMTP credentials from your email provider.
 */
export const nodemailerConfig: Partial<NodemailerConfig> = {
  server: {
    host: process.env.EMAIL_SERVER_HOST || "smtp.ethereal.email",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER || "",
      pass: process.env.EMAIL_SERVER_PASSWORD || "",
    },
  },
  from: process.env.EMAIL_FROM || "noreply@harfbase.com",
};
