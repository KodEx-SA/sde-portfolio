import "dotenv/config";

export const env = {
  // Server
  PORT: Number(process.env.PORT ?? 8080),
  NODE_ENV: process.env.NODE_ENV ?? "development",

  // CORS - comma-separated list of allowed frontend origins
  // e.g. "https://ashleydevhub.vercel.app,http://localhost:3000"
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  // Chatbot (Groq)
  GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",

  // Contact form email (Nodemailer via SMTP - Gmail, etc.)
  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? process.env.SMTP_USER ?? "",

  // Optional persistence (Supabase) - leave blank to run with no DB
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  // Simple shared-secret to protect the analytics dashboard endpoint
  ADMIN_TOKEN: process.env.ADMIN_TOKEN ?? "",
};

export const hasGroq = Boolean(env.GROQ_API_KEY);
export const hasEmail = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
export const hasSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
