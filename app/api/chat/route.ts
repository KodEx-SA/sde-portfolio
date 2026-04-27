import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/knowledge-base";

// =================================== Route handler ===================================

export async function POST(req: NextRequest) {
  // Handle incoming chat messages and stream AI responses
  try {
    const { messages } = await req.json(); // Expecting { messages: [{ role: "user" | "assistant", content: string }, ...] }

    if (!Array.isArray(messages) || messages.length === 0) {
      // Basic validation of the messages payload
      return NextResponse.json(
        { error: "Invalid messages payload" },
        { status: 400 },
      ); // Must be an array of messages with at least one message
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          // Set the appropriate headers for the Groq API request, including authorization
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // Construct the request body with the system prompt and user messages, specifying the model and streaming options
          model: "llama-3.1-8b-instant",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 400,
          temperature: 0.7,
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 },
      );
    }

    // Stream the response straight to the client
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
