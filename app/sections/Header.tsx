"use client"

import { useState, useEffect, useRef } from "react"
import {
  Terminal, X, Download,
  Home, User, Briefcase, FolderOpen, Code2,
  Trophy, Mail, ChevronDown,
} from "lucide-react"

// =================================== Navigation config ===================================
// Primary links appear in the desktop nav pill.
// More links appear in the "More" dropdown and always in the mobile panel.
// To add a new route: add it here - nowhere else needs to change.

const PRIMARY_LINKS = [
  { label: "Home",       href: "#hero",         icon: Home },
  { label: "About",      href: "#about",         icon: User },
  { label: "Experience", href: "#experience",    icon: Briefcase },
  { label: "Projects",   href: "#projects",      icon: FolderOpen },
  { label: "Skills",     href: "#skills",        icon: Code2 },
]

const MORE_LINKS = [
  { label: "Achievements", href: "#achievements", icon: Trophy },
  { label: "Contact",      href: "#contact",      icon: Mail },
]

// All links in order - used by the mobile slide-in panel
const ALL_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS].map((link, i) => ({
  ...link,
  num: String(i + 1).padStart(2, "0"),
}))

// =================================== Component ===================================

export default function Header() {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [moreOpen,       setMoreOpen]       = useState(false)
  const [activeSection,  setActiveSection]  = useState("hero")
  const [clock,          setClock]          = useState("")

  const panelRef = useRef<HTMLDivElement>(null)
  const moreRef  = useRef<HTMLDivElement>(null)

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Live SAST clock shown in mobile panel
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-ZA", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Lock body scroll while mobile panel is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Highlight the active section as the user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.35 },
    )
    ALL_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Close mobile panel on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setMobileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [mobileOpen])

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Smooth-scroll helper — also closes both menus
  const navigate = (href: string) => {
    setMobileOpen(false)
    setMoreOpen(false)
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 300)
  }

  const isActive = (href: string) => activeSection === href.replace("#", "")
  const moreIsActive = MORE_LINKS.some((l) => isActive(l.href))

  return (
    <>
      {/* =================================== TOP BAR =================================== */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-2xl border-b border-green-500/10 shadow-[0_2px_30px_rgba(0,0,0,0.7)]"
            : "bg-transparent"
        }`}
      >
        {/*
          Layout: flex with three children.
          - Logo - flex-none (natural width)
          - Desktop nav - flex-1 hidden md:flex (disappears on mobile, centres itself on desktop)
          - Right side  - flex-none ml-auto (always pushed to the far right)
        */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center gap-4">

          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); navigate("#hero") }}
            className="flex-none flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-green-500/50">
              <div className="absolute inset-0 bg-green-500/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Terminal className="relative z-10 w-4 h-4 text-green-400" />
            </div>
            <div className="hidden sm:block font-mono text-sm leading-none">
              <span className="text-white font-bold">ashley</span>
              <span className="text-green-400 font-bold">.</span>
              <span className="text-green-600">dev</span>
              <span className="inline-block w-[3px] h-3.5 bg-green-400 ml-0.5 align-middle animate-pulse" />
            </div>
          </a>

          {/* Desktop nav - hidden on mobile, centred on md+ */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative">
              {/* Corner bracket frame */}
              <span className="absolute -top-1.5 -left-2   w-3 h-3 border-t border-l border-green-500/50 pointer-events-none" />
              <span className="absolute -bottom-1.5 -left-2  w-3 h-3 border-b border-l border-green-500/50 pointer-events-none" />
              <span className="absolute -top-1.5 -right-2   w-3 h-3 border-t border-r border-green-500/50 pointer-events-none" />
              <span className="absolute -bottom-1.5 -right-2 w-3 h-3 border-b border-r border-green-500/50 pointer-events-none" />

              {/* Pill */}
              <div className="flex items-center gap-0.5 bg-black/40 backdrop-blur-md border border-green-500/15 rounded-xl px-1.5 py-1.5">

                {/* Primary links */}
                {PRIMARY_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => { e.preventDefault(); navigate(href) }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 group ${
                      isActive(href)
                        ? "bg-green-500 text-black shadow-[0_0_12px_rgba(74,222,128,0.4)]"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors duration-200 ${
                      isActive(href) ? "text-black" : "text-gray-600 group-hover:text-gray-300"
                    }`} />
                    {label}
                  </a>
                ))}

                {/* Divider */}
                <span className="w-px h-4 bg-green-500/20 mx-0.5" />

                {/* More dropdown */}
                <div ref={moreRef} className="relative">
                  <button
                    onClick={() => setMoreOpen((o) => !o)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                      moreIsActive
                        ? "bg-green-500 text-black shadow-[0_0_12px_rgba(74,222,128,0.4)]"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    More
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                  </button>

                  {moreOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-black/90 backdrop-blur-xl border border-green-500/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                      {MORE_LINKS.map(({ label, href, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          onClick={(e) => { e.preventDefault(); navigate(href) }}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-mono transition-all duration-150 ${
                            isActive(href)
                              ? "bg-green-500/15 text-green-400 border-l-2 border-green-500"
                              : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive(href) ? "text-green-400" : "text-gray-700"}`} />
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <span className="w-px h-4 bg-green-500/20 mx-0.5" />

                {/* Resume */}
                <a
                  href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-all duration-200 group"
                >
                  <Download className="w-3.5 h-3.5 group-hover:translate-y-px transition-transform duration-200" />
                  Resume
                </a>
              </div>
            </div>
          </nav>

          {/* Right side — ml-auto keeps it pinned to the right on all screen sizes */}
          <div className="flex-none ml-auto flex items-center">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col items-end justify-center gap-[5px] w-10 h-10"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className={`block h-px bg-green-400 transition-all duration-300 ${mobileOpen ? "w-5 rotate-45 translate-y-[6px] origin-center" : "w-5"}`} />
              <span className={`block h-px bg-green-400 transition-all duration-200 ${mobileOpen ? "w-0 opacity-0" : "w-3"}`} />
              <span className={`block h-px bg-green-400 transition-all duration-300 ${mobileOpen ? "w-5 -rotate-45 -translate-y-[6px] origin-center" : "w-5"}`} />
            </button>
          </div>

        </div>
      </header>

      {/* ── MOBILE SLIDE-IN PANEL ──────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#070707] border-l border-green-500/15 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-350 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        />

        {/* Panel title bar */}
        <div className="relative flex items-center justify-between px-5 h-16 border-b border-green-500/10 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-gray-700 font-mono text-[9px]">nav.sh</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-7 h-7 rounded-md border border-green-500/15 bg-green-500/5 flex items-center justify-center text-gray-600 hover:text-green-400 hover:border-green-500/35 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal prompt */}
        <div className="relative px-5 py-3 border-b border-green-500/8 flex-shrink-0">
          <p className="text-green-700 font-mono text-[10px]">$ cat navigation.txt</p>
        </div>

        {/* Nav links */}
        <nav className="relative flex-1 flex flex-col px-3 py-3 overflow-y-auto gap-0.5">
          {ALL_LINKS.map(({ label, href, icon: Icon, num }, i) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); navigate(href) }}
              style={{
                transform:               mobileOpen ? "translateX(0)" : "translateX(14px)",
                opacity:                 mobileOpen ? 1 : 0,
                transitionProperty:      "transform, opacity, background-color, color",
                transitionDuration:      "0.35s, 0.30s, 0.2s, 0.2s",
                transitionTimingFunction:"cubic-bezier(0.22,1,0.36,1), ease, ease, ease",
                transitionDelay:         mobileOpen ? `${i * 35}ms, ${i * 35}ms, 0ms, 0ms` : "0ms",
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive(href)
                  ? "bg-green-500/12 border border-green-500/25 text-green-400"
                  : "text-gray-500 hover:bg-green-500/5 hover:text-gray-200"
              }`}
            >
              <span className={`font-mono text-[9px] w-5 flex-shrink-0 ${isActive(href) ? "text-green-600" : "text-gray-700"}`}>
                {num}
              </span>
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive(href) ? "text-green-400" : "text-gray-600 group-hover:text-gray-400"}`} />
              <span className="font-mono text-sm font-semibold">
                {isActive(href) && <span className="text-green-600 mr-1 text-xs">›</span>}
                {label}
              </span>
              {isActive(href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
            </a>
          ))}
        </nav>

        {/* Panel footer */}
        <div className="relative flex-shrink-0 border-t border-green-500/10 px-5 py-5 flex flex-col gap-3">
          <a
            href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              opacity:    mobileOpen ? 1 : 0,
              transform:  mobileOpen ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 250ms, transform 0.4s ease 250ms",
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-mono font-bold bg-green-500 hover:bg-green-400 text-black rounded-lg transition-colors duration-200 shadow-[0_0_20px_rgba(74,222,128,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            resume.pdf
          </a>

          <div
            style={{ opacity: mobileOpen ? 1 : 0, transition: "opacity 0.4s ease 300ms" }}
            className="flex items-center justify-between"
          >
            <span className="text-gray-800 font-mono text-[9px]">
              ashley<span className="text-green-900">@dev</span>
            </span>
            <span className="text-green-900 font-mono text-[9px]">{clock} SAST</span>
          </div>
        </div>
      </div>
    </>
  )
}
