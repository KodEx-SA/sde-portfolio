"use client"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

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

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: "smooth" })
    }, 300)
  }

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/75 backdrop-blur-2xl border-b border-green-500/10 shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
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
            <div className="relative w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center overflow-hidden group-hover:border-green-500/60 transition-all duration-300">
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
              className="ml-3 px-4 py-1.5 text-xs font-mono font-bold bg-green-500 hover:bg-green-400 text-black rounded-md transition-all duration-200 shadow-[0_0_16px_rgba(74,222,128,0.35)] hover:shadow-[0_0_28px_rgba(74,222,128,0.6)] hover:-translate-y-px active:translate-y-0"
            >
              resume.pdf
            </a>
          </nav>

          {/* Mobile hamburger — morphing lines */}
          <button
            className="md:hidden flex flex-col items-end justify-center gap-[5px] w-10 h-10 relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px bg-green-400 origin-center transition-all duration-300 ease-in-out ${menuOpen ? "w-5 rotate-45 translate-y-[6px]" : "w-5"}`} />
            <span className={`block h-px bg-green-400 transition-all duration-200 ${menuOpen ? "w-0 opacity-0" : "w-3"}`} />
            <span className={`block h-px bg-green-400 origin-center transition-all duration-300 ease-in-out ${menuOpen ? "w-5 -rotate-45 -translate-y-[6px]" : "w-5"}`} />
          </button>
        </div>
      </header>

      {/* FULL-SCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#020202]/98 backdrop-blur-2xl" />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative large number */}
        <div className="absolute bottom-0 right-0 text-[20vw] font-black font-mono text-green-500/3 leading-none select-none pointer-events-none">
          AM
        </div>

        <div className="relative z-10 flex flex-col h-full px-8 pt-24 pb-10 max-w-lg">

          {/* Terminal header */}
          <div className="mb-8">
            <p
              className="text-green-600 font-mono text-xs"
              style={{ opacity: menuOpen ? 1 : 0, transition: "opacity 0.3s ease 0.1s" }}
            >
              $ cat navigation.txt
            </p>
            <div
              className="w-8 h-px bg-green-500/50 mt-2"
              style={{
                transform: menuOpen ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.4s ease 0.2s",
                transformOrigin: "left",
              }}
            />
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-0 flex-1">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                className="group flex items-center gap-5 py-4 border-b border-green-500/8 hover:border-green-500/30 transition-all duration-200"
                style={{
                  transform: menuOpen ? "translateX(0)" : "translateX(-30px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 65}ms, opacity 0.45s ease ${i * 65}ms, border-color 0.2s ease`,
                }}
              >
                <span className="text-green-800 font-mono text-[10px] w-5 flex-shrink-0">{link.num}</span>
                <span className="text-white font-mono font-black text-4xl tracking-tight group-hover:text-green-400 transition-colors duration-200">
                  {link.label}
                </span>
                <span className="ml-auto text-green-700 font-mono text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                  /
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div
            className="mt-8 flex flex-col gap-3"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(12px)",
              opacity: menuOpen ? 1 : 0,
              transition: "transform 0.4s ease 420ms, opacity 0.4s ease 420ms",
            }}
          >
            <a
              href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 text-center font-mono font-bold text-sm bg-green-500 hover:bg-green-400 text-black rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(74,222,128,0.25)]"
            >
              download resume.pdf
            </a>
            <p className="text-gray-700 font-mono text-[10px] text-center tracking-wide">
              ashley<span className="text-green-800">@dev</span> · rustenburg, north west, za
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
