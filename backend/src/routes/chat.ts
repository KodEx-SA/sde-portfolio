import { Router, Request, Response } from "express";
import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { env, hasGroq } from "../config/env";
import { SYSTEM_PROMPT } from "../lib/knowledgeBase";

export const chatRouter = Router();

const groq = hasGroq ? createGroq({ apiKey: env.GROQ_API_KEY }) : null;

chatRouter.post("/", async (req: Request, res: Response) => {
  if (!groq) {
    res.status(503).json({ error: "Chatbot is not configured (missing GROQ_API_KEY)." });
    return;
  }

  const body = req.body ?? {};
  const messages: UIMessage[] = Array.isArray(body.messages)
    ? body.messages
    : body.message
      ? [body.message]
      : [];

  if (messages.length === 0) {
    res.status(400).json({ error: "No messages provided." });
    return;
  }

  try {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (err) {
    console.error("[chat] error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong generating a response." });
    }
  }
});

