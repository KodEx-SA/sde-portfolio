"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, X, Download } from "lucide-react"

const navLinks = [
  { label: "home", href: "#hero", num: "01" },
  { label: "about", href: "#about", num: "02" },
  { label: "skills", href: "#skills", num: "03" },
  { label: "projects", href: "#projects", num: "04" },
  { label: "achievements", href: "#achievements", num: "05" },
  { label: "contact", href: "#contact", num: "06" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [time, setTime] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Live clock for the terminal panel
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  // Active section tracker
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    }, 320)
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-2xl border-b border-green-500/10 shadow-[0_2px_30px_rgba(0,0,0,0.7)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-20 h-16 flex items-center justify-between">

          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick("#hero") }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center overflow-hidden group-hover:border-green-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-green-500/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Terminal className="w-4 h-4 text-green-400 relative z-10" />
            </div>
            <div className="font-mono text-sm leading-none">
              <span className="text-white font-bold">ashley</span>
              <span className="text-green-400 font-bold">.</span>
              <span className="text-green-600">dev</span>
              <span className="inline-block w-[3px] h-3.5 bg-green-400 ml-0.5 align-middle animate-pulse" />
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className={`relative px-3 py-1.5 text-xs font-mono rounded-md transition-all duration-200 group ${
                    isActive ? "text-green-400" : "text-gray-500 hover:text-gray-200"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-md bg-green-500/8 border border-green-500/20" />
                  )}
                  <span className="text-[9px] text-green-800 mr-0.5 group-hover:text-green-600 transition-colors">
                    {link.num}.
                  </span>
                  <span className="relative z-10">{link.label}</span>
                </a>
              )
            })}
            <a
              href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-1.5 text-xs font-mono font-bold bg-green-500 hover:bg-green-400 text-black rounded-md transition-all duration-200 shadow-[0_0_16px_rgba(74,222,128,0.35)] hover:shadow-[0_0_28px_rgba(74,222,128,0.55)] hover:-translate-y-px"
            >
              resume.pdf
            </a>
          </nav>

          {/* Mobile — morphing hamburger */}
          <button
            className="md:hidden flex flex-col items-end justify-center gap-[5px] w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px bg-green-400 origin-right transition-all duration-300 ${menuOpen ? "w-5 rotate-45 translate-y-[6px] origin-center" : "w-5"}`} />
            <span className={`block h-px bg-green-400 transition-all duration-200 ${menuOpen ? "w-0 opacity-0" : "w-3"}`} />
            <span className={`block h-px bg-green-400 origin-right transition-all duration-300 ${menuOpen ? "w-5 -rotate-45 -translate-y-[6px] origin-center" : "w-5"}`} />
          </button>
        </div>
      </header>

      {/* ── SLIDE-IN PANEL (mobile) ── */}

      {/* Dim backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-400 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#070707] border-l border-green-500/15 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-400 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel top bar */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-green-500/10 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <span className="w-2 h-2 rounded-full bg-green-500/70" />
            <span className="ml-2 text-gray-700 font-mono text-[9px]">nav.sh</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-7 h-7 rounded-md border border-green-500/15 bg-green-500/5 flex items-center justify-center text-gray-600 hover:text-green-400 hover:border-green-500/35 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal prompt */}
        <div className="px-5 py-4 border-b border-green-500/8 flex-shrink-0">
          <p className="text-green-700 font-mono text-[10px]">$ cat navigation.txt</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-3 py-3 overflow-y-auto">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.replace("#", "")
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "hover:bg-green-500/5 hover:border border-transparent text-gray-500 hover:text-gray-200"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                  transform: menuOpen ? "translateX(0)" : "translateX(16px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms, opacity 0.3s ease ${i * 40}ms, background-color 0.2s ease, color 0.2s ease`,
                }}
              >
                <span className={`font-mono text-[9px] w-5 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-700"}`}>
                  {link.num}
                </span>
                <span className={`font-mono text-sm font-semibold ${isActive ? "text-green-400" : ""}`}>
                  {isActive && <span className="text-green-600 mr-1">&gt;</span>}
                  {link.label}
                </span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="flex-shrink-0 border-t border-green-500/10 px-5 py-5 flex flex-col gap-3">
          <a
            href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-mono font-bold bg-green-500 hover:bg-green-400 text-black rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(74,222,128,0.25)]"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 280ms, transform 0.4s ease 280ms",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            resume.pdf
          </a>

          {/* Status bar */}
          <div
            className="flex items-center justify-between"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 0.4s ease 320ms",
            }}
          >
            <span className="text-gray-800 font-mono text-[9px]">
              ashley<span className="text-green-900">@dev</span>
            </span>
            <span className="text-green-900 font-mono text-[9px]">{time} SAST</span>
          </div>
        </div>

        {/* Subtle grid texture inside panel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-l" />
      </div>
    </>
  )
}
