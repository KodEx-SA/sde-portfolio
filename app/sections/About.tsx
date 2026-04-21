"use client"

import Image from "next/image"
import { MapPin, Briefcase, GraduationCap, Code2 } from "lucide-react"

const roles = [
  { title: "AI Software Developer", company: "AI Global Networks", type: "Full-time" },
  { title: "Junior Software Developer & IT Technician", company: "Eullafied Tech Solutions", type: "Full-time" },
  { title: "Web Developer & Graphic Designer", company: "Maps Media Productions", type: "Freelance" },
]

const facts = [
  { icon: MapPin, label: "Location", value: "Rustenburg, North West, ZA" },
  { icon: Briefcase, label: "Active Roles", value: "3 concurrent positions" },
  { icon: GraduationCap, label: "Education", value: "NCV IT & Computer Sciences — Orbit TVET" },
  { icon: Code2, label: "GitHub", value: "github.com/KodEx-SA" },
]

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            about.me
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Who Am <span className="text-green-400">I?</span>
          </h2>
          <div className="w-10 h-0.5 bg-green-500/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16 items-start">

          {/* Left */}
          <div className="flex flex-col gap-8">

            {/* Photo */}
            <div className="relative w-fit">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent blur" />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-green-500/20">
                <Image
                  src="/assets/images/my_pic.png"
                  alt="Ashley Motsie"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-green-500/50" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-green-500/50" />
            </div>

            {/* Facts */}
            <div className="flex flex-col gap-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 group">
                  <div className="mt-0.5 w-7 h-7 rounded-md bg-green-500/8 border border-green-500/15 flex items-center justify-center flex-shrink-0 group-hover:border-green-500/35 transition-colors duration-200">
                    <Icon className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">{label}</p>
                    <p className="text-gray-300 font-mono text-xs mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8">

            {/* Bio */}
            <div className="space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed">
                I&apos;m a Full-Stack Developer and AI Engineer based in Rustenburg, South Africa — currently
                juggling three active roles while building production-ready software for real clients and businesses.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                I work across the full stack — from crafting responsive frontends with React and Next.js to building
                secure backend APIs, integrating AI/LLM pipelines, and deploying to cloud platforms. My work spans
                web apps, AI chatbots, e-commerce platforms, and internal business tools.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Under my GitHub organization{" "}
                <a
                  href="https://github.com/KodEx-SA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  KodEx-SA
                </a>
                , I freelance for South African businesses and build open-source projects. Actively seeking
                international remote opportunities.
              </p>
            </div>

            {/* Active roles */}
            <div>
              <p className="text-green-600 font-mono text-[10px] mb-4">$ cat active_roles.txt</p>
              <div className="flex flex-col gap-2.5">
                {roles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-green-500/10 bg-green-500/3 hover:border-green-500/25 hover:bg-green-500/6 transition-all duration-200 group"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-white font-mono text-xs font-bold leading-snug">{role.title}</p>
                      <p className="text-gray-600 font-mono text-[10px] mt-0.5">
                        {role.company}
                        <span className="text-green-800 ml-1.5">— {role.type}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
