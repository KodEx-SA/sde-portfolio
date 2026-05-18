"use client"

import {
  useState, useRef, useEffect, useCallback,
} from "react"
import {
  MessageCircle, X, Send, Bot, User,
  Minimize2, RotateCcw, ChevronRight,
} from "lucide-react"

// =================================== Types ===================================

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

// =================================== Constants ===================================

const SUGGESTIONS = [
  "What has Ashley built?",
  "Show me the tech stack",
  "Any AI projects?",
  "Take me to GitHub",
  "Blog posts?",
  "Is Ashley available?",
]

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey — I'm Smith, Ashley's portfolio assistant. I can guide you around, answer questions about the work, or route you to the right section.\n\nWhat are you looking for?",
}

// =================================== Nav-link parser ===================================

function NavLink({
  label,
  anchor,
  onNavigate,
}: {
  label: string
  anchor: string
  onNavigate: () => void
}) {
  const handleClick = () => {
    const id = anchor.replace(/^#/, "")
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    onNavigate()
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 mt-1 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 hover:border-green-500/50 font-mono text-[11px] font-semibold transition-all duration-200 group"
    >
      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      {label}
    </button>
  )
}

// Parses text containing [→ Label](#anchor) tokens into React nodes
function ParsedMessage({
  content,
  onNavigate,
}: {
  content: string
  onNavigate: () => void
}) {
  const NAV_REGEX = /\[→\s*([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = NAV_REGEX.exec(content)) !== null) {
    if (match.index > last) {
      parts.push(
        <span key={`t-${last}`} className="whitespace-pre-wrap">
          {content.slice(last, match.index)}
        </span>,
      )
    }
    parts.push(
      <NavLink
        key={`n-${match.index}`}
        label={match[1].trim()}
        anchor={match[2].trim()}
        onNavigate={onNavigate}
      />,
    )
    last = match.index + match[0].length
  }

  if (last < content.length) {
    parts.push(
      <span key={`t-${last}`} className="whitespace-pre-wrap">
        {content.slice(last)}
      </span>,
    )
  }

  return <>{parts}</>
}

// =================================== Typing indicator ===================================

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// =================================== Main component ===================================

export default function ChatBot() {
  const [open, setOpen]           = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [messages, setMessages]   = useState<Message[]>([WELCOME])
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [unread, setUnread]       = useState(0)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)
  const abortRef    = useRef<AbortController | null>(null)

  // Scroll to latest message
  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setUnread(0)
        scrollBottom()
      }, 0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open, scrollBottom])

  useEffect(() => {
    if (open) scrollBottom()
  }, [messages, open, scrollBottom])

  // Auto-grow textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [input])

  function uid() {
    return Math.random().toString(36).slice(2, 9)
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    setInput("")
    const userMsg: Message = { id: uid(), role: "user", content }
    const assistantId = uid()

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ])
    setLoading(true)

    // Build history (exclude welcome msg for API call)
    const history = [
      ...messages.filter((m) => m.id !== "welcome"),
      userMsg,
    ].map(({ role, content }) => ({ role, content }))

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error("Stream failed")

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") break

          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content ?? ""
            accumulated += delta
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: accumulated, isStreaming: true }
                  : m,
              ),
            )
          } catch {
            // malformed chunk — skip
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false }
            : m,
        ),
      )

      if (!open) setUnread((n) => n + 1)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, something went wrong. [→ Contact](#contact)",
                isStreaming: false,
              }
            : m,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function reset() {
    abortRef.current?.abort()
    setMessages([WELCOME])
    setInput("")
    setLoading(false)
  }

  function closeAndNavigate() {
    setOpen(false)
  }

  const isFirstOpen = messages.length === 1

  // =================================== Render ===================================

  return (
    <>
      {/* ── Toggle button ── */}
      <button
        onClick={() => { setOpen((o) => !o); setUnread(0) }}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className={`
          fixed bottom-6 right-5 z-50
          w-13 h-13 sm:w-14 sm:h-14
          rounded-full flex items-center justify-center
          shadow-[0_0_24px_rgba(74,222,128,0.25)]
          border transition-all duration-300
          ${open
            ? "bg-green-500 border-green-400 text-black rotate-0 scale-100"
            : "bg-[#0a0a0a] border-green-500/30 text-green-400 hover:border-green-500/60 hover:shadow-[0_0_32px_rgba(74,222,128,0.35)] hover:scale-105"
          }
        `}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-black text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className={`
            fixed z-40
            /* Mobile: full-width bottom sheet */
            bottom-0 left-0 right-0
            /* Desktop: floating panel above button */
            sm:bottom-24 sm:right-5 sm:left-auto
            /* Sizing */
            w-full sm:w-[360px] md:w-[380px]
            /* Height */
            h-[70dvh] sm:h-auto sm:max-h-[560px]
            /* Shape */
            rounded-t-2xl sm:rounded-2xl
            /* Surface */
            bg-[#0a0a0a] border border-green-500/15
            shadow-[0_-4px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(74,222,128,0.05)]
            sm:shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(74,222,128,0.05)]
            flex flex-col overflow-hidden
            transition-all duration-300
            ${minimised ? "sm:h-[52px]" : ""}
          `}
          style={{ maxHeight: minimised ? "52px" : undefined }}
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-green-500/10 flex-shrink-0 bg-[#0a0a0a]">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-green-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white leading-none">Smith</p>
              <p className="font-mono text-[10px] text-gray-600 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                Portfolio assistant
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimised((m) => !m)}
                aria-label="Minimise"
                className="hidden sm:flex w-7 h-7 rounded-lg hover:bg-white/5 items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={reset}
                aria-label="Reset conversation"
                className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors sm:hidden"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Body (hidden when minimised) ── */}
          {!minimised && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 scroll-smooth">

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar dot */}
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${msg.role === "assistant"
                        ? "bg-green-500/10 border border-green-500/25"
                        : "bg-white/5 border border-white/10"
                      }
                    `}>
                      {msg.role === "assistant"
                        ? <Bot className="w-3 h-3 text-green-400" />
                        : <User className="w-3 h-3 text-gray-400" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`
                      max-w-[82%] rounded-2xl px-3.5 py-2.5 font-mono text-[12px] leading-relaxed
                      ${msg.role === "assistant"
                        ? "bg-[#111] border border-green-500/10 text-gray-300 rounded-tl-sm"
                        : "bg-green-500/10 border border-green-500/15 text-green-100 rounded-tr-sm"
                      }
                    `}>
                      {msg.isStreaming && msg.content === "" ? (
                        <TypingDots />
                      ) : (
                        <ParsedMessage
                          content={msg.content}
                          onNavigate={closeAndNavigate}
                        />
                      )}
                      {msg.isStreaming && msg.content !== "" && (
                        <span className="inline-block w-1 h-3.5 bg-green-400/70 animate-pulse ml-0.5 rounded-sm align-middle" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Suggestions — shown only on first message */}
                {isFirstOpen && !loading && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="font-mono text-[10px] px-2.5 py-1 rounded-lg border border-green-500/15 bg-green-500/5 text-green-700 hover:text-green-300 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Input ── */}
              <div className="px-3 pb-3 pt-2 border-t border-green-500/10 flex-shrink-0 bg-[#0a0a0a]">
                {/* Safe area for iOS home bar */}
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask Smith anything…"
                    rows={1}
                    disabled={loading}
                    className="
                      flex-1 resize-none bg-[#111] border border-green-500/15 rounded-xl
                      px-3.5 py-2.5 font-mono text-[12px] text-gray-200
                      placeholder:text-gray-700
                      focus:outline-none focus:border-green-500/35 focus:ring-0
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200
                      leading-relaxed
                    "
                    style={{ minHeight: "42px", maxHeight: "96px" }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    aria-label="Send"
                    className="
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      bg-green-500 text-black
                      hover:bg-green-400 hover:shadow-[0_0_16px_rgba(74,222,128,0.4)]
                      disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
                      transition-all duration-200 self-end
                    "
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Footer */}
                <p className="font-mono text-[9px] text-gray-800 text-center mt-2 pb-safe">
                  Powered by Groq · Smith may make mistakes
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}