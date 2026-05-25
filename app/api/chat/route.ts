import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge-base";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  const messages: UIMessage[] = Array.isArray(body.messages)
    ? body.messages
    : [body.message];

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),  // ← await the async fn
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}