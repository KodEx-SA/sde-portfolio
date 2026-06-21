import dns from "node:dns";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { chatRouter } from "./routes/chat";
import { contactRouter } from "./routes/contact";
import { analyticsRouter } from "./routes/analytics";
import { healthRouter } from "./routes/health";
import { chatLimiter, contactLimiter, analyticsLimiter } from "./middleware/rateLimit";

// Some networks/ISPs have broken or flaky IPv6 routing, which makes Node's
// default dual-stack ("happy eyeballs") connection attempts hang on IPv6
// before falling back to IPv4. Prefer IPv4 outright to avoid that delay/failure
// when calling external APIs (Groq, SMTP, Supabase, etc.).
dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/chat", chatLimiter, chatRouter);
app.use("/api/contact", contactLimiter, contactRouter);
app.use("/api/analytics", analyticsLimiter, analyticsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(env.PORT, () => {
  console.log(`ashleydevhub-api listening on :${env.PORT} (${env.NODE_ENV})`);
  console.log(`Allowed origins: ${env.ALLOWED_ORIGINS.join(", ")}`);
});