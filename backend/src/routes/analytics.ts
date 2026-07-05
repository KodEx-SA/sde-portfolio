import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { env } from "../config/env";

export const analyticsRouter = Router();

interface TrackBody {
  event?: string;
  path?: string;
  meta?: Record<string, unknown>;
}

analyticsRouter.post("/track", async (req: Request, res: Response) => {
  const { event, path, meta }: TrackBody = req.body ?? {};

  if (!event?.trim()) {
    res.status(400).json({ error: "Missing 'event' field." });
    return;
  }

  if (!supabase) {
    res.status(202).json({ ok: true, persisted: false });
    return;
  }

  try {
    await supabase.from("analytics_events").insert({
      event: event.trim(),
      path: path ?? null,
      meta: meta ?? null,
    });
    res.status(202).json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[analytics] track error:", err);
    res.status(202).json({ ok: true, persisted: false });
  }
});

analyticsRouter.get("/stats", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: "Analytics persistence isn't configured (missing Supabase env vars)." });
    return;
  }

  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event, path, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) throw error;

    const totalsByEvent: Record<string, number> = {};
    for (const row of data ?? []) {
      totalsByEvent[row.event] = (totalsByEvent[row.event] ?? 0) + 1;
    }

    res.json({
      windowDays: 30,
      totalEvents: data?.length ?? 0,
      totalsByEvent,
      recent: (data ?? []).slice(0, 50),
    });
  } catch (err) {
    console.error("[analytics] stats error:", err);
    res.status(500).json({ error: "Failed to load analytics." });
  }
});
