import { Router, Request, Response } from "express";
import { hasGroq, hasEmail, hasSupabase } from "../config/env";

export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    services: {
      chat: hasGroq,
      contactEmail: hasEmail,
      analyticsPersistence: hasSupabase,
    },
    timestamp: new Date().toISOString(),
  });
});
