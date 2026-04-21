"use client"

import { Terminal, AnimatedSpan, TypingAnimation } from "@/components/ui/terminal"
import { Button } from "@/components/ui/button"
import { Meteors } from "@/components/ui/meteors"
import { ArrowDown, Download, FolderOpen, Mail, GitBranch, ExternalLink } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-20 py-24 overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Meteors */}
      <Meteors number={16} className="bg-green-400 shadow-[0_0_0_1px_rgba(74,222,128,0.08)]" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,197,94,0.07),transparent)] pointer-events-none" />

      {/* Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/8 text-green-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for opportunities
            </div>

            {/* Name */}
            <div className="space-y-1">
              <p className="text-green-400 font-mono text-sm">&gt; Hello, world. I&apos;m</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                Ashley K{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
                  Motsie
                </span>
              </h1>
            </div>

            <div className="w-14 h-px bg-gradient-to-r from-green-500/70 to-transparent" />

            {/* Title */}
            <div className="border-l-2 border-green-500/50 pl-4">
              <p className="text-gray-300 font-mono text-sm">Software Developer &amp; AI Engineer</p>
              <p className="text-gray-600 font-mono text-xs mt-0.5">Rustenburg, North West, South Africa</p>
            </div>

            {/* Bio */}
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              I build production-ready web apps and AI-powered tools.
              Passionate about clean code, great UX, and shipping things that work.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="group bg-green-500 hover:bg-green-400 text-black font-bold font-mono gap-2 px-6 text-sm shadow-[0_0_24px_rgba(74,222,128,0.4)] hover:shadow-[0_0_40px_rgba(74,222,128,0.6)] hover:-translate-y-px transition-all duration-300 rounded-lg"
              >
                <a href="#projects">
                  <FolderOpen className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200" />
                  View Projects
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group border-2 border-green-500/50 bg-green-500/5 text-green-400 hover:bg-green-500/12 hover:border-green-400 hover:text-green-300 font-mono font-semibold gap-2 px-6 text-sm hover:-translate-y-px transition-all duration-300 rounded-lg"
              >
                <a href="/assets/resume/Ashley_K_Motsie_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                  Resume
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="group border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 font-mono gap-2 px-6 text-sm hover:-translate-y-px transition-all duration-300 rounded-lg"
              >
                <a href="#contact">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Contact Me
                </a>
              </Button>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://github.com/KodEx-SA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-gray-600 hover:text-green-400 font-mono text-xs transition-colors duration-200"
              >
                <GitBranch className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
                KodEx-SA
              </a>
              <span className="text-gray-800 text-xs">·</span>
              <span className="text-gray-700 font-mono text-xs">&gt; 3 active roles</span>
            </div>
          </div>

          {/* Right — Terminal */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Corner brackets */}
              <div className="absolute -inset-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-500/40 rounded-tl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-500/40 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-500/40 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-500/40 rounded-br" />
              </div>

              <Terminal className="w-full bg-[#080808] border border-green-500/25 font-mono shadow-[0_0_60px_rgba(74,222,128,0.1),inset_0_0_40px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden">
                <TypingAnimation className="text-green-400 text-sm font-semibold">$ whoami</TypingAnimation>
                <AnimatedSpan className="text-emerald-300 text-sm pl-3 pb-1">
                  &gt; Ashley Koketso Motsie
                </AnimatedSpan>

                <TypingAnimation className="text-green-400 text-sm font-semibold mt-1">$ cat role.txt</TypingAnimation>
                <AnimatedSpan className="text-emerald-300 text-sm pl-3 pb-1">
                  &gt; Software Developer &amp; AI Engineer
                </AnimatedSpan>

                <TypingAnimation className="text-green-400 text-sm font-semibold mt-1">$ pwd</TypingAnimation>
                <AnimatedSpan className="text-emerald-300 text-sm pl-3 pb-1">
                  &gt; /za/north-west/rustenburg
                </AnimatedSpan>

                <TypingAnimation className="text-green-400 text-sm font-semibold mt-1">$ cat status.txt</TypingAnimation>
                <AnimatedSpan className="text-emerald-300 text-sm pl-3 pb-1">
                  &gt; Open to remote, on-site, hybrid
                </AnimatedSpan>

                <TypingAnimation className="text-green-400 text-sm font-semibold mt-1">$ ls skills/</TypingAnimation>
                <AnimatedSpan className="text-emerald-300 text-sm pl-3 pb-1">
                  &gt; react/ nextjs/ python/ ai/ fullstack/
                </AnimatedSpan>

                <AnimatedSpan className="text-green-400 text-base mt-2 animate-pulse">█</AnimatedSpan>
              </Terminal>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-700 z-10">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase">scroll</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  )
}
