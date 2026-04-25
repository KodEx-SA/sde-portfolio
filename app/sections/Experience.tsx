"use client"

import { useState } from "react"
import { Briefcase, Calendar, MapPin, ChevronDown } from "lucide-react"

const experiences = [
  {
    title: "AI Software Developer",
    company: "AI Global Networks",
    type: "Full-time",
    period: "2024 — Present",
    location: "Remote, South Africa",
    current: true,
    description:
      "Building and maintaining AI-powered web applications and chatbot systems for the company's client base. Responsible for designing the full-stack architecture, integrating LLM APIs, and deploying production-ready solutions.",
    highlights: [
      "Built a production Groq-powered AI chatbot with streaming responses and context memory",
      "Designed a secure Node.js/Express backend proxying LLM APIs to keep keys server-side",
      "Developed the company website with a full redesign using black/orange/white brand identity",
      "Integrated the 'Smith' AI assistant with company-specific knowledge and a macOS-style UI",
    ],
    stack: ["React", "Node.js", "Express", "Groq API", "Next.js", "JavaScript"],
  },
  {
    title: "Junior Software Developer & IT Technician",
    company: "Eullafied Tech Solutions",
    type: "Full-time",
    period: "2024 — Present",
    location: "Rustenburg, North West, ZA",
    current: true,
    description:
      "Developing internal business tools and client-facing web applications while also handling IT support and infrastructure. Key projects include a full Intern Management System and a Help Desk platform.",
    highlights: [
      "Built the Intern Management System (IMS) with dark split-panel login, sortable tables, CSV export, and SA ID validation",
      "Developed the Eullafied Help Desk with NestJS + React/TypeScript fully integrated with Supabase",
      "Implemented a 3-step intern registration flow with email notifications via Nodemailer",
      "Created avatar upload, role-based access, and a Windows batch launcher for CEO deployment",
    ],
    stack: ["NestJS", "React", "TypeScript", "Supabase", "PostgreSQL", "Nodemailer"],
  },
  {
    title: "Web Developer & Graphic Designer",
    company: "Maps Media Productions",
    type: "Freelance",
    period: "2023 — Present",
    location: "Rustenburg, North West, ZA",
    current: true,
    description:
      "Freelancing under the Maps Media Productions brand — designing and building websites for South African small businesses, hospitality brands, real estate, and modelling agencies. Also responsible for brand identity and graphic design.",
    highlights: [
      "Delivered websites for Isong Cafe, Mogokare Lodge, Mpetha Construction, and Taahirah Modelling Agency",
      "Used unsolicited demo sites as pitch tools to win new clients across industries",
      "Designed brand identities including logos, colour systems, and print materials",
      "Managed full project lifecycle from discovery to deployment and handover",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Figma", "Canva"],
  },
]

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <section id="experience" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_50%,rgba(34,197,94,0.03),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            experience.log
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Work <span className="text-green-400">Experience</span>
          </h2>
          <div className="w-10 h-0.5 bg-green-500/50" />
        </div>

        {/* Active roles badge */}
        <div className="flex items-center gap-3 mb-10">
          <p className="text-green-600 font-mono text-xs">$ echo $ACTIVE_ROLES</p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-500 font-mono text-xs">3 concurrent active positions</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/40 via-green-500/20 to-transparent" />

          <div className="flex flex-col gap-4">
            {experiences.map((exp, i) => {
              const isOpen = expanded === i

              return (
                <div key={i} className="relative pl-10 md:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-4 top-5 flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                      exp.current
                        ? "bg-green-400 border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                        : "bg-transparent border-green-500/40"
                    }`} />
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-xl border bg-[#080808] transition-all duration-300 overflow-hidden ${
                      isOpen ? "border-green-500/25" : "border-green-500/10 hover:border-green-500/20"
                    }`}
                  >
                    {/* Card header — always visible, clickable */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
                    >
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        {/* Role + current badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`font-mono font-bold text-sm md:text-base transition-colors duration-200 ${
                            isOpen ? "text-green-400" : "text-white group-hover:text-green-400"
                          }`}>
                            {exp.title}
                          </h3>
                          {exp.current && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-500">
                              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                              current
                            </span>
                          )}
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/8 bg-white/3 text-gray-600">
                            {exp.type}
                          </span>
                        </div>

                        {/* Company + meta */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-green-800" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-green-800" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-green-800" />
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      {/* Chevron */}
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 flex-shrink-0 mt-1 transition-all duration-300 group-hover:text-green-500 ${
                          isOpen ? "rotate-180 text-green-500" : ""
                        }`}
                      />
                    </button>

                    {/* Expandable content */}
                    <div
                      className={`transition-all duration-400 ease-in-out ${
                        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-5 pb-5 flex flex-col gap-5 border-t border-green-500/8">

                        {/* Description */}
                        <p className="text-gray-500 text-sm leading-relaxed pt-4">
                          {exp.description}
                        </p>

                        {/* Highlights */}
                        <div>
                          <p className="text-green-700 font-mono text-[10px] mb-3">$ cat highlights.txt</p>
                          <ul className="flex flex-col gap-2">
                            {exp.highlights.map((h, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-gray-500 text-xs leading-relaxed">
                                <span className="text-green-600 font-mono mt-0.5 flex-shrink-0">›</span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Stack */}
                        <div>
                          <p className="text-green-700 font-mono text-[10px] mb-3">$ ls stack/</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.stack.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-green-500/6 text-green-400 border border-green-500/15 hover:border-green-500/30 transition-colors duration-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
