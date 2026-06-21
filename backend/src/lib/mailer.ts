import nodemailer from "nodemailer";
import { env, hasEmail } from "../config/env";

/**
 * SMTP transport for the contact form.
 * For Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=you@gmail.com,
 * SMTP_PASS=<a Google App Password, not your normal password>.
 * Any SMTP provider works the same way (Zoho, Outlook, Resend's SMTP bridge, etc.).
 */
export const mailer = hasEmail
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;
