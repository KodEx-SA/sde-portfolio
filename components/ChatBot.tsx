"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, Bot, User, Loader2, Minimize2, MessageSquare } from "lucide-react"

// =================================== Types ===================================

interface Message {
  role: "user" | "assistant"
  content: string
}

// =================================== Constants ===================================

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm **Smith**, Ashley's AI assistant. Ask me anything about his skills, projects, or availability.",
}

const SUGGESTIONS = [
  "What's Ashley's tech stack?",
  "Show me his projects",
  "Is he available for work?",
  "How do I contact Ashley?",
]

// =================================== Helpers ===================================

function renderContent(text: string) { // Convert markdown-like syntax to HTML for bold and inline code styling
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold for **text**
    .replace(/`([^`]+)`/g, "<code class='bg-green-500/10 text-green-300 px-1 rounded text-[11px]'>$1</code>") // Inline code for `text` 
    .replace(/\n/g, "<br/>") // Preserve newlines
}

// =================================== Component ===================================

export default function ChatBot() {
  const [open, setOpen] = useState(false); // Chat window open state
  const [minimised, setMinimised] = useState(false); // Chat window minimised state
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]); // Chat history
  const [input, setInput] = useState(""); // Current input value
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimised) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimised]);

  // Track unread when closed
  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread((u) => u + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const handleOpen = () => {
    setOpen(true);
    setMinimised(false);
    setUnread(0);
  }

  const handleClose = () => {
    abortRef.current?.abort()
    setOpen(false)
    setMinimised(false)
  }

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return

    const userMessage: Message = { role: "user", content: trimmed }
    const history = [...messages, userMessage]

    setMessages(history)
    setInput("")
    setStreaming(true)

    // Placeholder for the streaming assistant reply
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error("Stream failed")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") break

          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content ?? ""
            if (!token) continue

            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content + token,
              }
              return updated
            })
          } catch {
            // Malformed chunk — skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or contact Ashley directly.",
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }, [messages, streaming])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // =================================== Trigger button ===================================
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-black shadow-[0_0_24px_rgba(74,222,128,0.5)] hover:shadow-[0_0_36px_rgba(74,222,128,0.7)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    )
  }

  // =================================== Chat window ===================================
  return (
    <div className="fixed bottom-6 right-6 z-40 w-[440px] sm:w-[400px] flex flex-col rounded-2xl border border-green-500/25 bg-[#080808] shadow-[0_0_60px_rgba(74,222,128,0.12),0_24px_48px_rgba(0,0,0,0.8)] overflow-hidden">

      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/15 bg-[#0a0a0a] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClose}
              aria-label="Close"
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors duration-150"
            />
            <button
              onClick={() => setMinimised((m) => !m)}
              aria-label="Minimise"
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors duration-150"
            />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Bot identity */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <Bot className="w-3 h-3 text-green-400" />
            </div>
            <div>
              <p className="text-white font-mono text-xs font-bold leading-none">Smith</p>
              <p className="text-green-600 font-mono text-[9px] leading-none mt-0.5">ashley&apos;s ai assistant</p>
            </div>
          </div>
        </div>

        {/* Online indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-600 font-mono text-[9px]">online</span>
        </div>
      </div>

      {/* Minimised state */}
      {minimised ? (
        <button
          onClick={() => setMinimised(false)}
          className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-green-400 font-mono text-xs transition-colors duration-200"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          click to expand
        </button>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[380px] scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === "assistant"
                  ? "bg-green-500/15 border border-green-500/30"
                  : "bg-white/5 border border-white/10"
                  }`}>
                  {msg.role === "assistant"
                    ? <Bot className="w-3 h-3 text-green-400" />
                    : <User className="w-3 h-3 text-gray-400" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed font-mono ${msg.role === "assistant"
                  ? "bg-[#111] border border-green-500/10 text-gray-300 rounded-tl-sm"
                  : "bg-green-500 text-black font-semibold rounded-tr-sm"
                  }`}>
                  {msg.role === "assistant" ? (
                    msg.content
                      ? <span dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                      : <Loader2 className="w-3.5 h-3.5 animate-spin text-green-500" />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips — show only at start */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 hover:bg-green-500/15 hover:border-green-500/40 transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-green-500/10 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={streaming}
              placeholder="Ask me anything..."
              className="flex-1 bg-black/40 border border-green-500/15 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-green-500/35 focus:ring-1 focus:ring-green-500/15 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all duration-200 flex-shrink-0"
            >
              {streaming
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </>
      )}
    </div>
  )
}
