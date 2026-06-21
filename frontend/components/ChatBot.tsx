"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useChat, Chat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  MessageCircle, X, Send, Bot, User,
  RotateCcw, ChevronRight, Terminal, Maximize2, Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// =================================== Constants ===================================

const WELCOME =
  "Initialising Smith v1.0 — portfolio assistant.\n\n> Connected to Ashley's knowledge base.\n> Ready. Ask me anything or pick a shortcut below."

const SUGGESTIONS = [
  "What has Ashley built?",
  "Show me the stack",
  "Any AI projects?",
  "Take me to GitHub",
  "Blog posts?",
  "Is Ashley available?",
]

// Helper: extract plain text from a v5 UIMessage
function getMessageText(msg: { parts?: Array<{ type: string; text?: string }>, content?: string }): string {
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
  }
  return msg.content ?? ""
}

// =================================== Nav-link parser ===================================

function NavLink({ label, anchor, onNavigate }: {
  label: string; anchor: string; onNavigate: () => void
}) {
  return (
    <button
      onClick={() => {
        document.getElementById(anchor.replace(/^#/, ""))
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
        onNavigate()
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1 mt-1.5 rounded-md bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 hover:border-green-500/60 font-mono text-[11px] font-semibold transition-all duration-200 group cursor-pointer"
    >
      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      {label}
    </button>
  )
}

function ParsedMessage({ content, onNavigate }: { content: string | undefined; onNavigate: () => void }) {
  const text = content ?? ""
  const NAV_RE = /\[→\s*([^\]]+)\]\(([^)]+)\)/g
  const nodes: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = NAV_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={`t${last}`} className="whitespace-pre-wrap break-words">{text.slice(last, m.index)}</span>)
    nodes.push(<NavLink key={`n${m.index}`} label={m[1].trim()} anchor={m[2].trim()} onNavigate={onNavigate} />)
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(<span key={`t${last}`} className="whitespace-pre-wrap break-words">{text.slice(last)}</span>)
  return <>{nodes}</>
}

// =================================== Typing dots ===================================

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-bounce"
          style={{ animationDelay: `${i * 160}ms`, animationDuration: "1s" }} />
      ))}
    </span>
  )
}

// =================================== Traffic light button ===================================

function TrafficLight({ color, symbol, onClick, title, className }: {
  color: "red" | "yellow" | "green"
  symbol: string
  onClick?: () => void
  title?: string
  className?: string
}) {
  const [hovered, setHovered] = useState(false)
  const colors = {
    red: { base: "bg-[#ff5f57]", border: "border-[#e0443e]", glow: "shadow-[0_0_6px_rgba(255,95,87,0.6)]" },
    yellow: { base: "bg-[#ffbd2e]", border: "border-[#dea123]", glow: "shadow-[0_0_6px_rgba(255,189,46,0.6)]" },
    green: { base: "bg-[#28c840]", border: "border-[#1aab2e]", glow: "shadow-[0_0_6px_rgba(40,200,64,0.6)]" },
  }
  const c = colors[color]
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-[13px] h-[13px] rounded-full border flex items-center justify-center transition-all duration-150 flex-shrink-0",
        c.base, c.border,
        hovered && c.glow,
        !onClick && "cursor-default",
        className,
      )}
      aria-label={title}
    >
      {hovered && onClick && (
        <span className="absolute inset-0 flex items-center justify-center text-black/70 font-bold leading-none select-none"
          style={{ fontSize: "8px" }}>
          {symbol}
        </span>
      )}
    </button>
  )
}

// =================================== Status indicator ===================================

function StatusDot({ status }: { status: "ready" | "streaming" | "submitted" | "error" }) {
  const cfg = {
    ready: { color: "bg-green-500", pulse: false, label: "ready" },
    streaming: { color: "bg-green-400", pulse: true, label: "streaming" },
    submitted: { color: "bg-yellow-400", pulse: true, label: "thinking" },
    error: { color: "bg-red-500", pulse: false, label: "error" },
  }[status]
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-1.5 h-1.5 rounded-full inline-block", cfg.color, cfg.pulse && "animate-pulse")} />
      <span className="font-mono text-[9px] text-gray-600">{cfg.label}</span>
    </span>
  )
}

// =================================== Scan line overlay ===================================

function ScanLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
      }}
    />
  )
}

// =================================== Main component ===================================

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [maximised, setMaximised] = useState(false)
  const [unread, setUnread] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [bootDone, setBootDone] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const openRef = useRef(false)

  const [chat] = useState(() => new Chat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/chat`,
    }),
    messages: [{
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: WELCOME }],
    }],
    onFinish() {
      if (!openRef.current) setUnread((n) => n + 1)
    },
  }))

  const { messages, sendMessage, stop, setMessages, status } = useChat({ chat })

  const isLoading = status === "streaming" || status === "submitted"
  const dotStatus = status === "streaming" ? "streaming"
    : status === "submitted" ? "submitted"
      : "ready"

  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    openRef.current = open
    if (open) {
      setUnread(0)
      setTimeout(scrollBottom, 80)
      setTimeout(() => inputRef.current?.focus(), 150)
      // boot animation
      if (!bootDone) {
        setTimeout(() => setBootDone(true), 600)
      }
    }
  }, [open, scrollBottom, bootDone])

  useEffect(() => {
    if (open) scrollBottom()
  }, [messages, open, scrollBottom])

  // Auto-grow textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`
  }, [inputValue])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && open) setOpen(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  function reset() {
    stop()
    setMessages([{ id: "welcome", role: "assistant", parts: [{ type: "text", text: WELCOME }] }])
    setInputValue("")
  }

  function handleSend() {
    const text = inputValue.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInputValue("")
  }

  function sendSuggestion(text: string) {
    if (isLoading) return
    sendMessage({ text })
  }

  const pristine = messages.length === 1

  // Window sizing classes
  const windowCls = cn(
    "fixed z-40 flex flex-col transition-all duration-300",
    // Mobile: full-screen bottom sheet
    "bottom-0 left-0 right-0 rounded-t-2xl",
    // Desktop: floating panel
    "sm:bottom-24 sm:right-5 sm:left-auto sm:rounded-2xl",
    !maximised
      ? "w-full sm:w-[460px] h-[80dvh] sm:h-[600px]"
      : "sm:bottom-4 sm:right-4 sm:left-4 sm:top-4 sm:w-auto sm:h-auto w-full h-[96dvh]",
    minimised && !maximised && "sm:!h-[44px] h-[44px] bottom-24 rounded-2xl left-auto right-5 w-[300px]",
    "bg-[#0d0d0d]",
    "border border-green-500/20",
    "shadow-[0_-4px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(74,222,128,0.06),inset_0_1px_0_rgba(74,222,128,0.05)]",
    "sm:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_0_1px_rgba(74,222,128,0.06),inset_0_1px_0_rgba(74,222,128,0.05)]",
    "overflow-hidden",
  )

  return (
    <>
      {/* ── FAB toggle ── */}
      <button
        onClick={() => { setOpen((o) => !o); setUnread(0) }}
        aria-label={open ? "Close Smith" : "Open Smith"}
        className={cn(
          "fixed bottom-6 right-5 z-50",
          "w-14 h-14 rounded-full",
          "flex items-center justify-center",
          "border-2 transition-all duration-300 ease-out",
          open
            ? "bg-green-500 border-green-400 text-black scale-95 rotate-90"
            : [
              "bg-[#0d0d0d] border-green-500/35 text-green-400",
              "hover:border-green-400/70 hover:scale-110",
              "shadow-[0_0_0_4px_rgba(74,222,128,0.06),0_0_20px_rgba(74,222,128,0.15)]",
              "hover:shadow-[0_0_0_6px_rgba(74,222,128,0.1),0_0_32px_rgba(74,222,128,0.35)]",
            ],
        )}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-green-500 text-black text-[10px] font-bold font-mono flex items-center justify-center border-2 border-[#0d0d0d] animate-bounce">
            {unread}
          </span>
        )}
      </button>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Terminal window ── */}
      {open && (
        <div className={windowCls}>
          <ScanLines />

          {/* ── Title bar ── */}
          <div className="relative z-10 flex items-center gap-3 px-3.5 py-2.5 border-b border-green-500/12 bg-[#111]/90 backdrop-blur-sm flex-shrink-0 select-none"
            style={{ minHeight: "44px" }}>

            {/* Traffic lights */}
            <div className="flex items-center gap-[6px] flex-shrink-0">
              <TrafficLight color="red" symbol="✕" onClick={() => setOpen(false)} title="Close" />
              <TrafficLight color="yellow" symbol="—" onClick={() => setMinimised((m) => !m)} title={minimised ? "Expand" : "Minimise"} />
              <TrafficLight color="green" symbol={maximised ? "⊡" : "⊞"} onClick={() => { setMaximised((m) => !m); setMinimised(false) }} title={maximised ? "Restore" : "Maximise"} />
            </div>

            {/* Title — drag handle feel */}
            <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
              <Terminal className="w-3 h-3 text-green-600/80 flex-shrink-0" />
              <span className="font-mono text-[10px] text-gray-600 truncate tracking-wide">
                smith<span className="text-green-800">@</span>ashley-dev<span className="text-gray-700">:~$</span>
              </span>
              {/* Live status pill */}
              <span className={cn(
                "hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm",
                "font-mono text-[8px] uppercase tracking-widest",
                isLoading
                  ? "text-yellow-600/80 bg-yellow-500/8 border border-yellow-500/15"
                  : "text-green-800 bg-green-500/6 border border-green-500/10",
              )}>
                <span className={cn("w-1 h-1 rounded-full", isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-700")} />
                {isLoading ? (status === "streaming" ? "streaming" : "thinking") : "online"}
              </span>
            </div>

            {/* Right: reset */}
            <button
              onClick={reset}
              title="New session"
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-gray-700 hover:text-green-400 hover:bg-green-500/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* ── Messages area ── */}
          {!minimised && (
            <div className="relative z-10 flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 scroll-smooth min-h-0"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(74,222,128,0.15) transparent" }}>

              {/* Boot header */}
              <div className="font-mono text-[9px] pb-2 border-b border-green-500/8 flex items-center justify-between">
                <span>
                  <span className="text-green-800">smith</span>
                  <span className="text-gray-800"> v1.0.0 </span>
                  <span className="text-gray-800">·</span>
                  <span className="text-gray-800"> groq/llama-3.1-8b-instant</span>
                </span>
                <span className="text-gray-800">{new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}</span>
              </div>

              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1
                const streaming = isLoading && isLast && msg.role === "assistant"
                const isBot = msg.role === "assistant"
                const text = getMessageText(msg)

                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col gap-1",
                    !isBot && "items-end",
                  )}>

                    {/* Role badge */}
                    <div className={cn(
                      "flex items-center gap-1.5",
                      !isBot && "flex-row-reverse",
                    )}>
                      <div className={cn(
                        "w-[18px] h-[18px] rounded-[4px] flex items-center justify-center flex-shrink-0",
                        isBot
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-white/5 border border-white/8",
                      )}>
                        {isBot
                          ? <Bot className="w-2.5 h-2.5 text-green-500/80" />
                          : <User className="w-2.5 h-2.5 text-gray-600" />}
                      </div>
                      <span className={cn(
                        "font-mono text-[8px] font-bold uppercase tracking-[0.15em]",
                        isBot ? "text-green-800" : "text-gray-700",
                      )}>
                        {isBot ? "smith" : "you"}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "font-mono text-[12px] leading-[1.65] px-3 py-2 rounded-xl max-w-[88%]",
                      isBot
                        ? "bg-[#141414] border border-green-500/8 text-gray-300 rounded-tl-[4px] self-start"
                        : "bg-green-500/[0.07] border border-green-500/[0.1] text-green-100 rounded-tr-[4px] self-end text-right",
                    )}>
                      {isBot ? (
                        <>
                          {streaming && text === "" ? (
                            <TypingDots />
                          ) : (
                            <ParsedMessage content={text} onNavigate={() => setOpen(false)} />
                          )}
                          {streaming && text !== "" && (
                            <span className="inline-block w-[2px] h-[13px] bg-green-400 animate-[blink_1s_step-end_infinite] ml-0.5 align-middle rounded-full" />
                          )}
                        </>
                      ) : (
                        <span className="whitespace-pre-wrap break-words">{text}</span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Suggestions */}
              {pristine && !isLoading && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-6">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendSuggestion(s)}
                      className={cn(
                        "font-mono text-[10px] px-2.5 py-1 rounded-md cursor-pointer transition-all duration-200",
                        "border border-green-500/12 bg-transparent text-green-900",
                        "hover:text-green-300 hover:bg-green-500/10 hover:border-green-500/30",
                        "active:scale-95",
                      )}
                    >
                      <span className="text-green-800 mr-1">›</span>{s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}

          {/* ── Input ── */}
          {!minimised && (
            <div className="relative z-10 border-t border-green-500/10 bg-[#0f0f0f]/95 px-3 pb-3 pt-2 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend() }}
                className="flex items-end gap-2"
              >
                {/* prompt symbol */}
                <span className="font-mono text-green-700 text-[13px] pb-[9px] flex-shrink-0 select-none leading-none">
                  ❯
                </span>

                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  placeholder="ask something…"
                  rows={1}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 resize-none bg-transparent",
                    "font-mono text-[12px] text-gray-200 leading-relaxed",
                    "placeholder:text-gray-800 caret-green-400",
                    "focus:outline-none border-0 ring-0",
                    "disabled:opacity-30 disabled:cursor-not-allowed",
                    "py-[9px]",
                  )}
                  style={{ minHeight: "38px", maxHeight: "100px" }}
                />

                {/* Stop / Send */}
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    className={cn(
                      "w-8 h-8 rounded-lg flex-shrink-0 self-end mb-0.5",
                      "flex items-center justify-center",
                      "bg-red-500/10 text-red-400 border border-red-500/20",
                      "hover:bg-red-500/20 hover:border-red-500/40",
                      "transition-all duration-200 active:scale-95",
                    )}
                    aria-label="Stop"
                    title="Stop generation"
                  >
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-[2px]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    aria-label="Send"
                    className={cn(
                      "w-8 h-8 rounded-lg flex-shrink-0 self-end mb-0.5",
                      "flex items-center justify-center",
                      "bg-green-500/10 text-green-400 border border-green-500/20",
                      "hover:bg-green-500 hover:text-black hover:border-green-500",
                      "hover:shadow-[0_0_12px_rgba(74,222,128,0.35)]",
                      "disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-green-500/10 disabled:hover:text-green-400 disabled:hover:border-green-500/20 disabled:hover:shadow-none",
                      "transition-all duration-200 active:scale-95",
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Footer */}
              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <StatusDot status={dotStatus} />
                <span className="font-mono text-[8px] text-gray-800 hidden sm:block">
                  shift+↵ newline · esc close
                </span>
                <span className="font-mono text-[8px] text-gray-800 sm:hidden">
                  shift+↵ newline
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  )
}
