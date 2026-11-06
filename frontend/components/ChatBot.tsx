/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useChat, Chat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { X, Send, RotateCcw, ChevronRight, Minus, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

// =================================== Constants ===================================

// Keep in sync with the model used in backend/src/routes/chat.ts
const MODEL_LABEL = "groq - gpt-oss-120b"

const WELCOME =
  "Smith online - portfolio assistant.\n\n> Knowledge base loaded: Ashley's work, stack and availability.\n> Ready. Ask me anything, or run a command below."

type Command = { cmd: string; hint: string; prompt?: string }

// Commands are shortcuts: the ones with a `prompt` send that exact question to Smith.
const COMMANDS: Command[] = [
  { cmd: "/projects", hint: "what Ashley has built", prompt: "What has Ashley built?" },
  { cmd: "/stack", hint: "the tech stack", prompt: "Show me the stack" },
  { cmd: "/ai", hint: "AI projects", prompt: "Any AI projects?" },
  { cmd: "/github", hint: "jump to GitHub", prompt: "Take me to GitHub" },
  { cmd: "/availability", hint: "is Ashley available?", prompt: "Is Ashley available?" },
  { cmd: "/help", hint: "list commands" },
  { cmd: "/clear", hint: "start a new session" },
]

const stamp = () => new Date().toLocaleTimeString("en-ZA", { hour12: false })

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

// =================================== Nav-link parser (Smith's "actions") ===================================

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
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-sm bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#c9fbff] hover:bg-[#00e5ff]/20 hover:border-[#00e5ff] font-mono text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
    >
      <span className="text-[#00b8d4] text-[9px]">action</span>
      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      {label}
    </button>
  )
}

function ParsedMessage({ content, onNavigate }: { content: string | undefined; onNavigate: () => void }) {
  const text = content ?? ""
  const NAV_RE = /\[(?:→\s*)?([^\]]+)\]\(\s*(#[^)\s]+)\s*\)/g
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

// =================================== Small pieces ===================================

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] px-1 py-0.5" aria-label="Smith is thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 bg-[#7df9ff]/70 animate-bounce"
          style={{ animationDelay: `${i * 160}ms`, animationDuration: "1s" }} />
      ))}
    </span>
  )
}

// Compact square control used in the title bar
function HudButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="w-6 h-6 flex items-center justify-center rounded-sm border border-[#00e5ff]/25 text-[#7fb8c4] hover:text-[#04070d] hover:bg-[#00e5ff] hover:border-[#00e5ff] transition-colors duration-150"
    >
      {children}
    </button>
  )
}

// Small animated reactor used as the launcher icon
function Orb({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true" focusable="false">
      <g stroke="#00e5ff">
        <g className="reactor-cw" style={{ transformOrigin: "24px 24px" }}>
          <circle cx="24" cy="24" r="20" strokeWidth="1.5" strokeDasharray="4 5" />
        </g>
        <g className="reactor-ccw" style={{ transformOrigin: "24px 24px" }}>
          <circle cx="24" cy="24" r="14" strokeWidth="2" strokeDasharray="18 6" />
        </g>
      </g>
      <circle className="reactor-core" cx="24" cy="24" r="5" fill="#00e5ff" />
    </svg>
  )
}

const STATE_STYLE = {
  STANDBY: { text: "text-[#00b8d4]", dot: "bg-[#00b8d4]", pulse: false },
  PROCESSING: { text: "text-[#ffb86c]", dot: "bg-[#ffb86c]", pulse: true },
  RESPONDING: { text: "text-[#00e5ff]", dot: "bg-[#00e5ff]", pulse: true },
  FAULT: { text: "text-[#ff6b6b]", dot: "bg-[#ff6b6b]", pulse: false },
} as const

// =================================== Main component ===================================

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [maximised, setMaximised] = useState(false)
  const [unread, setUnread] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [stamps, setStamps] = useState<Record<string, string>>({})
  const [latency, setLatency] = useState<number | null>(null)
  const [note, setNote] = useState<{ kind: "help" } | { kind: "text"; text: string } | null>(null)
  const [session] = useState(() => Math.random().toString(16).slice(2, 6).toUpperCase())

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const openRef = useRef(false)
  const sentAt = useRef<number | null>(null)
  const gotFirstToken = useRef(false)

  const [chat] = useState(() => new Chat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/chat`,
    }),
    messages: [{
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: WELCOME }],
    }],
  }))

  const { messages, sendMessage, stop, setMessages, regenerate, status } = useChat({ chat })

  const isLoading = status === "streaming" || status === "submitted"

  // Count a reply as "unread" when it finishes while the window is closed
  const prevStatus = useRef(status)
  useEffect(() => {
    const was = prevStatus.current
    prevStatus.current = status
    if (status === "ready" && (was === "streaming" || was === "submitted") && !openRef.current) {
      setUnread((n) => n + 1)
    }
  }, [status])

  const agentState =
    status === "error" ? "FAULT"
      : status === "submitted" ? "PROCESSING"
        : status === "streaming" ? "RESPONDING"
          : "STANDBY"
  const st = STATE_STYLE[agentState]

  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    openRef.current = open
    if (open) {
      setUnread(0)
      setTimeout(scrollBottom, 80)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open, scrollBottom])

  useEffect(() => {
    if (open) scrollBottom()
  }, [messages, open, scrollBottom])

  // Timestamp each message the first time it appears
  useEffect(() => {
    setStamps((prev) => {
      let changed = false
      const next = { ...prev }
      for (const m of messages) {
        if (!next[m.id]) { next[m.id] = stamp(); changed = true }
      }
      return changed ? next : prev
    })
  }, [messages])

  // Measure real time-to-first-token for the latest request
  useEffect(() => {
    if (status === "submitted") {
      sentAt.current = performance.now()
      gotFirstToken.current = false
    } else if (status === "streaming" && sentAt.current !== null && !gotFirstToken.current) {
      gotFirstToken.current = true
      setLatency(performance.now() - sentAt.current)
    } else if (status === "ready" || status === "error") {
      sentAt.current = null
    }
  }, [status])

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
    setNote(null)
    setStamps({})
    setLatency(null)
  }

  function runCommand(raw: string) {
    const head = raw.trim().split(/\s+/)[0].toLowerCase()
    const exact = COMMANDS.find((c) => c.cmd === head)
    const partial = COMMANDS.filter((c) => c.cmd.startsWith(head))
    const cmd = exact ?? (partial.length === 1 ? partial[0] : undefined)

    if (!cmd) {
      setNote({
        kind: "text",
        text: partial.length > 1
          ? `ambiguous: ${head} - did you mean ${partial.map((c) => c.cmd).join(", ")}?`
          : `unknown command: ${head} - type /help`,
      })
      return
    }
    if (cmd.cmd === "/clear") return reset()
    if (cmd.cmd === "/help") return setNote({ kind: "help" })
    if (cmd.prompt) {
      setNote(null)
      sendMessage({ text: cmd.prompt })
    }
  }

  function handleSend() {
    const text = inputValue.trim()
    if (!text || isLoading) return
    setInputValue("")
    if (text.startsWith("/")) return runCommand(text)
    setNote(null)
    sendMessage({ text })
  }

  function sendSuggestion(text: string) {
    if (isLoading) return
    setNote(null)
    sendMessage({ text })
  }

  const pristine = messages.length === 1
  const commandMatches =
    inputValue.startsWith("/") && !inputValue.includes(" ")
      ? COMMANDS.filter((c) => c.cmd.startsWith(inputValue.toLowerCase()) && c.cmd !== inputValue.toLowerCase())
      : []

  // Window sizing classes
  const windowCls = cn(
    "fixed z-40 flex flex-col transition-all duration-300",
    // Mobile: full-screen bottom sheet
    "bottom-0 left-0 right-0 rounded-t-xl",
    // Desktop: floating panel
    "sm:bottom-24 sm:right-5 sm:left-auto sm:rounded-md",
    !maximised
      ? "w-full sm:w-[460px] h-[80dvh] sm:h-[600px]"
      : "sm:bottom-4 sm:right-4 sm:left-4 sm:top-4 sm:w-auto sm:h-auto w-full h-[96dvh]",
    minimised && !maximised && "sm:!h-[44px] h-[44px] bottom-24 rounded-md left-auto right-5 w-[300px]",
    "bg-[#05090f]",
    "border border-[#00e5ff]/30",
    "shadow-[0_-4px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,229,255,0.08),0_0_30px_rgba(0,229,255,0.06)]",
    "sm:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,229,255,0.08),0_0_40px_rgba(0,229,255,0.08)]",
    "overflow-hidden",
  )

  return (
    <>
      {/* ======================== FAB toggle ======================== */}
      <button
        onClick={() => { setOpen((o) => !o); setUnread(0) }}
        aria-label={open ? "Close Smith" : "Open Smith"}
        className={cn(
          "fixed bottom-6 right-5 z-50",
          "w-14 h-14 rounded-full",
          "flex items-center justify-center",
          "border-2 transition-all duration-300 ease-out",
          open
            ? "bg-[#00e5ff] border-[#7df9ff] text-black scale-95 rotate-90"
            : [
              "bg-[#05090f] border-[#00e5ff]/45 text-[#7df9ff]",
              "hover:border-[#7df9ff] hover:scale-110",
              "shadow-[0_0_0_4px_rgba(0,229,255,0.07),0_0_20px_rgba(0,229,255,0.2)]",
              "hover:shadow-[0_0_0_6px_rgba(0,229,255,0.12),0_0_32px_rgba(0,229,255,0.4)]",
            ],
        )}
      >
        {open ? <X className="w-5 h-5" /> : <Orb className="w-9 h-9" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#00e5ff] text-black text-[10px] font-bold font-mono flex items-center justify-center border-2 border-[#05090f] animate-bounce">
            {unread}
          </span>
        )}
      </button>

      {/* ======================== Mobile backdrop ======================== */}
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ======================== Agent console window ======================== */}
      {open && (
        <div className={windowCls} role="dialog" aria-label="Smith agent console">
          {/* HUD corner brackets */}
          <span aria-hidden className="pointer-events-none absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]/70 z-20" />
          <span aria-hidden className="pointer-events-none absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]/70 z-20" />
          <span aria-hidden className="pointer-events-none absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]/70 z-20" />
          <span aria-hidden className="pointer-events-none absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]/70 z-20" />

          {/* Processing sweep */}
          {isLoading && (
            <div aria-hidden className="hud-sweep pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#00e5ff] shadow-[0_0_12px_#00e5ff]" />
          )}

          {/* ======================== Title bar ======================== */}
          <div className="relative z-10 flex items-center gap-3 px-3.5 py-2 border-b border-[#00e5ff]/20 bg-[#08111a]/95 flex-shrink-0 select-none"
            style={{ minHeight: "44px" }}>

            <div className="flex-1 min-w-0 leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#00e5ff] truncate">
                  SMITH <span className="text-[#0097a7]">{"//"}</span> AGENT CONSOLE
                </span>
                <span className={cn("hidden sm:inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest", st.text)}>
                  <span className={cn("w-1 h-1 rounded-full", st.dot, st.pulse && "animate-pulse")} />
                  {agentState}
                </span>
              </div>
              {!minimised && (
                <div className="font-mono text-[9px] text-[#6a9aa6] truncate">
                  session #{session} · {MODEL_LABEL}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <HudButton onClick={reset} title="New session"><RotateCcw className="w-3 h-3" /></HudButton>
              <HudButton onClick={() => setMinimised((m) => !m)} title={minimised ? "Expand" : "Minimise"}><Minus className="w-3 h-3" /></HudButton>
              <HudButton onClick={() => { setMaximised((m) => !m); setMinimised(false) }} title={maximised ? "Restore" : "Maximise"}>
                {maximised ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </HudButton>
              <HudButton onClick={() => setOpen(false)} title="Close"><X className="w-3 h-3" /></HudButton>
            </div>
          </div>

          {/* ======================== Log ======================== */}
          {!minimised && (
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              className="relative z-10 flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3.5 scroll-smooth min-h-0"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,229,255,0.25) transparent" }}
            >
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1
                const streaming = isLoading && isLast && msg.role === "assistant"
                const isBot = msg.role === "assistant"
                const text = getMessageText(msg)

                return (
                  <div key={msg.id} className={cn("flex flex-col gap-1", !isBot && "items-end")}>
                    <div className={cn(
                      "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em]",
                      !isBot && "flex-row-reverse",
                    )}>
                      <span className={isBot ? "text-[#00e5ff]" : "text-[#00ff9c]"}>{isBot ? "[smith]" : "[you]"}</span>
                      {stamps[msg.id] && <span className="text-[#6a9aa6]">{stamps[msg.id]}</span>}
                    </div>

                    <div className={cn(
                      "font-mono text-[12px] leading-[1.65] px-3 py-2 max-w-[92%]",
                      isBot
                        ? "border-l-2 border-[#00e5ff]/60 bg-[#00e5ff]/[0.04] text-[#d7f9ff] rounded-r-md self-start"
                        : "border-r-2 border-[#00ff9c]/60 bg-[#00ff9c]/[0.04] text-white rounded-l-md self-end text-right",
                    )}>
                      {isBot ? (
                        <>
                          {streaming && text === "" ? (
                            <TypingDots />
                          ) : (
                            <ParsedMessage content={text} onNavigate={() => setOpen(false)} />
                          )}
                          {streaming && text !== "" && (
                            <span className="inline-block w-[2px] h-[13px] bg-[#7df9ff] animate-[blink_1s_step-end_infinite] ml-0.5 align-middle rounded-full" />
                          )}
                        </>
                      ) : (
                        <span className="whitespace-pre-wrap break-words">{text}</span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* ======================== Commands (first message only) ======================== */}
              {pristine && !isLoading && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6a9aa6]">[sys] quick commands</div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMANDS.filter((c) => c.prompt).map((c) => (
                      <button
                        key={c.cmd}
                        onClick={() => sendSuggestion(c.prompt!)}
                        title={c.hint}
                        className={cn(
                          "font-mono text-[10px] px-2.5 py-1 rounded-sm cursor-pointer transition-all duration-200",
                          "border border-[#00e5ff]/30 bg-[#00e5ff]/[0.04] text-[#9ff6ff]",
                          "hover:text-[#04070d] hover:bg-[#00e5ff] hover:border-[#00e5ff]",
                          "active:scale-95",
                        )}
                      >
                        {c.cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================== Local system notes (never sent to the model) ======================== */}
              {note?.kind === "text" && (
                <div className="font-mono text-[11px] text-[#ffb86c]">[sys] {note.text}</div>
              )}
              {note?.kind === "help" && (
                <div className="font-mono text-[11px] text-[#bfefff] border border-[#00e5ff]/20 bg-[#00e5ff]/[0.03] rounded-sm px-3 py-2">
                  <div className="text-[9px] uppercase tracking-[0.18em] text-[#6a9aa6] mb-1.5">[sys] commands</div>
                  {COMMANDS.map((c) => (
                    <div key={c.cmd} className="flex gap-3">
                      <span className="text-[#00e5ff] w-[96px] flex-shrink-0">{c.cmd}</span>
                      <span className="text-[#8fb3bd]">{c.hint}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ======================== Link fault ======================== */}
              {status === "error" && (
                <div className="flex items-center gap-3 font-mono text-[11px] text-[#ff6b6b]">
                  <span>[sys] link fault - the response failed.</span>
                  <button
                    onClick={() => regenerate()}
                    className="px-2 py-0.5 rounded-sm border border-[#ff6b6b]/40 hover:bg-[#ff6b6b]/15 uppercase tracking-wider text-[10px]"
                  >
                    retry
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}

          {/* ======================== Input ======================== */}
          {!minimised && (
            <div className="relative z-10 border-t border-[#00e5ff]/20 bg-[#08111a]/95 px-3 pb-3 pt-2 flex-shrink-0">
              {/* Command autocomplete */}
              {commandMatches.length > 0 && (
                <div className="mb-2 flex flex-col border border-[#00e5ff]/25 rounded-sm bg-[#05090f] overflow-hidden">
                  {commandMatches.map((c) => (
                    <button
                      key={c.cmd}
                      type="button"
                      onClick={() => { setInputValue(c.cmd); inputRef.current?.focus() }}
                      className="flex gap-3 px-2.5 py-1 font-mono text-[11px] text-left hover:bg-[#00e5ff]/10"
                    >
                      <span className="text-[#00e5ff] w-[96px] flex-shrink-0">{c.cmd}</span>
                      <span className="text-[#8fb3bd]">{c.hint}</span>
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); handleSend() }}
                className="flex items-end gap-2"
              >
                <span className="font-mono text-[#00b8d4] text-[13px] pb-[9px] flex-shrink-0 select-none leading-none" aria-hidden>
                  ❯
                </span>

                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && commandMatches.length > 0) {
                      e.preventDefault()
                      setInputValue(commandMatches[0].cmd)
                      return
                    }
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  aria-label="Message Smith"
                  placeholder="ask something, or type /"
                  rows={1}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 resize-none bg-transparent",
                    "font-mono text-[12px] text-[#e6fbff] leading-relaxed",
                    "placeholder:text-[#4f7c88] caret-[#7df9ff]",
                    "focus:outline-none border-0 ring-0",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "py-[9px]",
                  )}
                  style={{ minHeight: "38px", maxHeight: "100px" }}
                />

                {/* ======================== Stop / Send ======================== */}
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    className={cn(
                      "w-8 h-8 rounded-sm flex-shrink-0 self-end mb-0.5",
                      "flex items-center justify-center",
                      "bg-red-500/10 text-red-400 border border-red-500/30",
                      "hover:bg-red-500/20 hover:border-red-500/50",
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
                      "w-8 h-8 rounded-sm flex-shrink-0 self-end mb-0.5",
                      "flex items-center justify-center",
                      "bg-[#00e5ff]/10 text-[#7df9ff] border border-[#00e5ff]/30",
                      "hover:bg-[#00e5ff] hover:text-black hover:border-[#00e5ff]",
                      "hover:shadow-[0_0_12px_rgba(0,229,255,0.4)]",
                      "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#00e5ff]/10 disabled:hover:text-[#7df9ff] disabled:hover:border-[#00e5ff]/30 disabled:hover:shadow-none",
                      "transition-all duration-200 active:scale-95",
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* ======================== Telemetry ======================== */}
              <div className="flex items-center justify-between mt-1.5 px-0.5 font-mono text-[9px] uppercase tracking-wider text-[#6a9aa6]">
                <span className={cn("inline-flex items-center gap-1.5", st.text)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", st.dot, st.pulse && "animate-pulse")} />
                  {agentState}
                </span>
                <span>
                  {latency !== null && <>lat {(latency / 1000).toFixed(1)}s · </>}
                  msg {Math.max(messages.length - 1, 0)}
                </span>
                <span className="hidden sm:block">/ commands · esc close</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
