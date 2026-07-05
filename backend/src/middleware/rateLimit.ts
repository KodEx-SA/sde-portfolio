import rateLimit from "express-rate-limit";

// Chat: generous enough for real conversation
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages - please slow down a bit." },
});

// Contact form: a visitor won't submit more than a couple times a minute.
export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions - please try again later." },
});

// Analytics
export const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
