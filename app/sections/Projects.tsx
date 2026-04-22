"use client"

import Image from "next/image"
import { ExternalLink, GitBranch, ArrowUpRight, Globe } from "lucide-react"

const projects = [
  {
    title: "Generative AI Chatbot",
    description: "Real-time conversational AI chatbot powered by Groq API with streaming responses, context memory, typing indicators, and a polished dark UI. Built for production at AI Global Networks.",
    image: "/assets/images/AI-Assistant.png",
    tags: ["Generative AI"],
    stack: ["React", "Vite", "Groq API", "JavaScript"],
    github: "https://github.com/KodEx-SA/ReactJs-ChatBot",
    live: "https://generativechatbot.netlify.app/",
    year: "2024",
    featured: true,
  },
  {
    title: "Sasbo AI Symposium 2026",
    description: "Finance union AI Symposium platform — advanced scroll animations, particle networks, countdown timer, event schedule, speaker showcase, and registration. Built with Next.js 15 and TypeScript.",
    image: "/assets/images/sasbo.jpeg",
    tags: ["Event", "Finance"],
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/KodEx-SA/sasbo-ai-symposium",
    live: "https://sasbo-ai-symposium.vercel.app/",
    year: "2025",
    featured: true,
  },
  {
    title: "Modern Ubizo iMarket",
    description: "Full-featured South African e-commerce landing platform connecting buyers and sellers. Responsive, fast, and built with a modern stack.",
    image: "/assets/images/ubizo.png",
    tags: ["E-Commerce"],
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/KodEx-SA/ubizo-e-commerce-landing-page",
    live: "https://ubizo-e-commerce-landing-page.onrender.com/",
    year: "2024",
    featured: false,
  },
  {
    title: "Isong Cafe — Bar & Grill",
    description: "A polished, mobile-first website for a local cafe and grill featuring a full menu showcase, brand story, location info, and smooth scroll UX.",
    image: "/assets/images/Isong.png",
    tags: ["Hospitality"],
    stack: ["HTML5", "Tailwind CSS", "JavaScript"],
    github: "https://github.com/KodEx-SA/Isong-Cafe-website",
    live: "https://isong-cafe.vercel.app/",
    year: "2023",
    featured: false,
  },
  {
    title: "Gauteng Rentals Directory",
    description: "AI-powered rental property search for Gauteng — fast filtering, smart recommendations, and a clean UI designed for South African users.",
    image: "/assets/images/gauteng-rentals.png",
    tags: ["Real Estate"],
    stack: ["HTML5", "CSS3", "JavaScript"],
    github: "https://github.com/KodEx-SA/jhb-rental-directory",
    live: "https://gauteng-rental-directory-landing-pa.vercel.app/",
    year: "2024",
    featured: false,
  },
  {
    title: "TMA Modelling Agency",
    description: "Professional brand website for Taahirah Modelling Agency in Mahikeng — showcasing talent, services, and bookings with a high-fashion aesthetic.",
    image: "",
    tags: ["Branding"],
    stack: ["HTML5", "CSS3", "JavaScript"],
    github: "https://github.com/KodEx-SA/TMA",
    live: "https://tmaofficial.co.za/",
    year: "2023",
    featured: false,
  },
]

function TerminalPlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#060606] p-6">
      <div className="w-full max-w-xs font-mono text-xs space-y-1.5">
        <p className="text-green-500">$ npm run dev</p>
        <p className="text-gray-700">&gt; building {title.toLowerCase().replace(/\s+/g, "-")}...</p>
        <p className="text-gray-700">&gt; compiled successfully</p>
        <p className="text-emerald-400">&gt; ready on localhost:3000</p>
        <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse align-middle" />
      </div>
    </div>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            projects.work
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Featured <span className="text-green-400">Work</span>
          </h2>
          <div className="w-10 h-0.5 bg-green-500/50" />
        </div>

        {/* ── FEATURED — large horizontal cards ── */}
        <div className="flex flex-col gap-5 mb-10">
          {featured.map((project, i) => (
            <div
              key={i}
              className="group grid grid-cols-1 md:grid-cols-2 rounded-xl border border-green-500/10 bg-[#080808] overflow-hidden hover:border-green-500/30 transition-all duration-400 hover:shadow-[0_0_40px_rgba(74,222,128,0.06)]"
            >
              {/* Image panel */}
              <div className={`h-56 md:h-auto relative overflow-hidden flex-shrink-0 ${i % 2 !== 0 ? "md:order-last" : ""}`}>
                {project.image ? (
                  <>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                    />
                    {/* Side fade into content */}
                    <div className={`absolute inset-y-0 w-28 z-10 ${
                      i % 2 !== 0
                        ? "left-0 bg-gradient-to-r from-[#080808] to-transparent"
                        : "right-0 bg-gradient-to-l from-[#080808] to-transparent"
                    }`} />
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080808]/70 to-transparent z-10 md:hidden" />
                    {/* Color tint on hover */}
                    <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors duration-400 z-10" />
                  </>
                ) : (
                  <TerminalPlaceholder title={project.title} />
                )}
              </div>

              {/* Content panel */}
              <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-4 justify-center">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    {project.year}
                  </span>
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/3 border border-white/8 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-white font-mono font-bold text-xl md:text-2xl group-hover:text-green-400 transition-colors duration-200 leading-snug">
                  {project.title}
                </h3>

                {/* Animated underline */}
                <div className="h-px w-8 group-hover:w-full bg-gradient-to-r from-green-500/60 to-transparent transition-all duration-500 ease-out" />

                <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/3 text-gray-500 border border-white/6 hover:border-green-500/20 hover:text-gray-400 transition-colors duration-200">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-1.5 text-xs font-mono font-bold text-black bg-green-500 hover:bg-green-400 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-[0_0_16px_rgba(74,222,128,0.3)] hover:shadow-[0_0_28px_rgba(74,222,128,0.5)] hover:-translate-y-px"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Live Demo
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-green-400 border border-green-500/25 hover:border-green-400/50 hover:bg-green-500/8 px-5 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-px"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    Source
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── REST — compact cards with thumbnails ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((project, i) => (
            <div
              key={i}
              className="group rounded-xl border border-green-500/10 bg-[#080808] hover:border-green-500/25 hover:shadow-[0_0_24px_rgba(74,222,128,0.05)] transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-0.5"
            >
              {/* Thumbnail */}
              <div className="relative h-32 w-full overflow-hidden flex-shrink-0">
                {project.image ? (
                  <>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
                    <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#060606] flex items-center justify-center">
                    <div className="font-mono text-[9px] text-gray-800 space-y-1 px-3">
                      <p className="text-green-900">$ npm run dev</p>
                      <p>&gt; ready...</p>
                    </div>
                  </div>
                )}

                {/* Year badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-green-500/20 text-green-600">
                    {project.year}
                  </span>
                </div>

                {/* Live indicator */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-green-500/20 text-green-500">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    live
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2.5 p-4 flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-green-500/8 border border-green-500/15 text-green-700">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-white font-mono font-bold text-xs group-hover:text-green-400 transition-colors duration-200 leading-snug">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-[10px] leading-relaxed flex-1 line-clamp-3">
                  {project.description}
                </p>

                {/* Stack pills */}
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 2).map((s) => (
                    <span key={s} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/3 text-gray-700">
                      {s}
                    </span>
                  ))}
                  {project.stack.length > 2 && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/3 text-gray-800">
                      +{project.stack.length - 2}
                    </span>
                  )}
                </div>

                {/* Action links */}
                <div className="flex items-center gap-3 pt-2 border-t border-green-500/8">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-green-500 hover:text-green-300 transition-colors"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      Live
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-mono text-gray-700 hover:text-gray-400 transition-colors"
                  >
                    <GitBranch className="w-3 h-3" />
                    Source
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://github.com/KodEx-SA"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-green-400 border border-white/8 hover:border-green-500/25 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px"
          >
            <GitBranch className="w-4 h-4" />
            View all projects on GitHub
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  )
}
