import { Resend } from "resend";
import { env, hasEmail } from "../config/env";

/**
 * Resend sends email over HTTPS (port 443), not raw SMTP — important because
 * Render's free tier blocks outbound traffic to SMTP ports (25, 465, 587)
 * to prevent spam abuse, which silently breaks Nodemailer-style SMTP sending.
 *
 * Without a verified sending domain, Resend requires the "from" address to be
 * onboarding@resend.dev and only supports sending TO the email address you
 * signed up to Resend with. That's exactly this use case (contact form mails
 * land in your own inbox), so no domain verification is needed.
 *
 * If you ever want a custom "from" address (e.g. contact@ashleydevhub.com) or
 * to send to other recipients, verify a domain at resend.com/domains and the
 * code below keeps working unchanged - just update the "from" address.
 */
export const resend = hasEmail ? new Resend(env.RESEND_API_KEY) : null;