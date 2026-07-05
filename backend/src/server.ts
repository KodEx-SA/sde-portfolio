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

dns.setDefaultResultOrder("ipv4first");

const app = express();
app.set("trust proxy", 1);

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

app.use((_req, res) => { // 404 for any unknown routes
  res.status(404).json({ error: "Not found." });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
