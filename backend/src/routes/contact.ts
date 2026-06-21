import { Router, Request, Response } from "express";
import { mailer } from "../lib/mailer";
import { supabase } from "../lib/supabase";
import { env, hasEmail } from "../config/env";

export const contactRouter = Router();

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // Honeypot field - real visitors never fill this in.
  // Make sure the frontend includes a hidden input named "company" that bots tend to fill.
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

contactRouter.post("/", async (req: Request, res: Response) => {
  const body: ContactBody = req.body ?? {};
  const { name, email, subject, message, company } = body;

  // Honeypot - silently accept but do nothing.
  if (company) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: "Name, email, subject, and message are all required." });
    return;
  }

  if (!EMAIL_RE.test(email.trim())) {
    res.status(400).json({ error: "That doesn't look like a valid email address." });
    return;
  }

  if (!hasEmail || !mailer) {
    res.status(503).json({ error: "Contact form isn't configured yet (missing SMTP credentials)." });
    return;
  }

  try {
    await mailer.sendMail({
      from: `"Portfolio Contact Form" <${env.SMTP_USER}>`,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email.trim(),
      subject: `[Portfolio] ${subject.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message.trim())}</p>
      `,
    });

    if (supabase) {
      await supabase.from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    res.status(500).json({ error: "Failed to send your message. Please try again or email directly." });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
