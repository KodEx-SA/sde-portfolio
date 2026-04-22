"use client"

import { useState, useEffect } from "react"
import { Terminal, GitBranch, Mail, MapPin, ArrowUpRight, Download } from "lucide-react"

const quickLinks = [
  { label: "home", href: "#hero" },
  { label: "about", href: "#about" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
  { label: "achievements", href: "#achievements" },
  { label: "contact", href: "#contact" },
]

const techStack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Magic UI",
  "Lucide Icons",
]

const socials = [
  { label: "GitHub", href: "https://github.com/KodEx-SA", icon: GitBranch },
  { label: "Email", href: "mailto:ashley@kodex-sa.dev", icon: Mail },
]

const terminalLines = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Ashley Koketso Motsie" },
  { prompt: true, text: "cat status.txt" },
  { prompt: false, text: "✓ Open to remote opportunities" },
  { prompt: true, text: "ls expertise/" },
  { prompt: false, text: "fullstack/ ai/ devops/ design/" },
  { prompt: true, text: "_" },
]

function MiniTerminal() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines >= terminalLines.length) return
    const delay = terminalLines[visibleLines].prompt ? 600 : 300
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleLines])

  return (
    <div className="w-full rounded-xl border border-green-500/20 bg-[#060606] overflow-hidden shadow-[0_0_40px_rgba(74,222,128,0.06)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/10 bg-[#080808]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-gray-700 font-mono text-[9px]">ashley@dev: ~</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-xs space-y-1 min-h-[140px]">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            {line.prompt ? (
              <>
                <span className="text-green-600 flex-shrink-0">❯</span>
                <span className="text-green-400">
                  {line.text === "_" ? (
                    <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse align-middle" />
                  ) : (
                    line.text
                  )}
                </span>
              </>
            ) : (
              <span className="text-gray-500 pl-4">{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-green-500/10 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-green-500/35 to-transparent" />
      <div className="absolute bottom-0 right-0 text-[14vw] font-black font-mono text-green-500/[0.018] leading-none select-none pointer-events-none">AM</div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-20 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Col 1 — Brand + terminal (spans 4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-green-400" />
                </div>
                <div className="font-mono text-sm">
                  <span className="text-white font-bold">ashley</span>
                  <span className="text-green-400 font-bold">.</span>
                  <span className="text-green-600">dev</span>
                </div>
              </div>
              <p className="text-gray-700 font-mono text-xs leading-relaxed">
                Software Developer &amp; AI Engineer building production-ready software from South Africa.
              </p>
              <div className="flex items-center gap-1.5 text-gray-700 font-mono text-[10px]">
                <MapPin className="w-3 h-3 text-green-800 flex-shrink-0" />
                Rustenburg, North West, ZA
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-600 font-mono text-[10px]">open to work</span>
              </div>
            </div>

            {/* Mini terminal */}
            <MiniTerminal />
          </div>

          {/* Col 2 — Quick links (spans 2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ ls pages/</p>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-1.5 text-gray-600 hover:text-green-400 font-mono text-xs transition-colors duration-200"
                >
                  <span className="text-green-900 group-hover:text-green-700 transition-colors text-[10px]">/</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Stack (spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ cat stack.txt</p>
            <div className="flex flex-col gap-2">
              {techStack.map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-800 flex-shrink-0" />
                  <span className="text-gray-700 font-mono text-xs">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4 — Connect (spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ connect --me</p>
            <div className="flex flex-col gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-gray-600 hover:text-green-400 font-mono text-xs transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-md bg-green-500/6 border border-green-500/12 flex items-center justify-center flex-shrink-0 group-hover:border-green-500/40 group-hover:bg-green-500/12 transition-all duration-200">
                    <Icon className="w-3 h-3" />
                  </div>
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto" />
                </a>
              ))}

              {/* Resume button */}
              <a
                href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold bg-green-500/8 border border-green-500/20 text-green-500 rounded-lg hover:bg-green-500/15 hover:border-green-400/40 hover:text-green-400 transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5 group-hover:translate-y-px transition-transform duration-200" />
                resume.pdf
              </a>

              {/* Roles note */}
              <div className="mt-1 p-3 rounded-lg border border-green-500/8 bg-green-500/3">
                <p className="text-green-700 font-mono text-[9px] mb-1">$ echo $ROLES</p>
                <p className="text-gray-700 font-mono text-[10px] leading-relaxed">
                  3 concurrent active positions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative h-px w-full mb-7">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/18 to-transparent" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-800 font-mono text-[10px]">
            &copy; {year} Ashley Koketso Motsie &nbsp;·&nbsp; All rights reserved
          </p>
          <div className="flex items-center gap-3 text-gray-800 font-mono text-[10px]">
            <span>crafted with <span className="text-green-900">♥</span> in rustenburg, za</span>
            <span className="text-gray-900">·</span>
            <span className="text-green-900">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
