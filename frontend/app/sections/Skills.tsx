"use client"

const skillGroups = [
  {
    category: "Frontend",
    command: "$ ls frontend/",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    command: "$ ls backend/",
    skills: ["Node.js", "Express", "NestJS", "Python", "FastAPI", "Flask", "REST APIs"],
  },
  {
    category: "Databases",
    command: "$ ls databases/",
    skills: ["PostgreSQL", "Neon DB", "Supabase", "Prisma ORM", "MongoDB", "Redis"],
  },
  {
    category: "AI & ML",
    command: "$ ls ai/",
    skills: ["Groq API", "OpenAI API", "Anthropic Claude", "LangChain", "LiveKit", "PyTorch"],
  },
  {
    category: "DevOps & Tools",
    command: "$ ls devops/",
    skills: ["Docker", "Git", "GitHub", "Netlify", "Vercel", "Render", "Linux Mint"],
  },
  {
    category: "Design",
    command: "$ ls design/",
    skills: ["Figma", "Canva", "UI/UX Design", "Responsive Design", "Graphic Design"],
  },
]

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "15+", label: "Projects Shipped" },
  { value: "1", label: "Active Role" },
  { value: "3+", label: "Technologies" },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(122,162,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(122,162,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(122,162,247,0.04),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ======================== Header ======================== */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7aa2f7]/20 bg-[#7aa2f7]/5 text-[#7aa2f7] text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7aa2f7]" />
            tech.stack
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Skills &amp; <span className="text-[#7dcfff]">Tools</span>
          </h2>
          <div className="w-10 h-0.5 bg-[#7aa2f7]/50" />
        </div>

        {/* ======================== Grid ======================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="relative p-5 rounded-xl border border-[#7aa2f7]/10 bg-[#080808] hover:border-[#7aa2f7]/25 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#7aa2f7]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#7aa2f7]/25 group-hover:border-[#7aa2f7]/50 transition-colors duration-300" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#7aa2f7]/25 group-hover:border-[#7aa2f7]/50 transition-colors duration-300" />

              <div className="relative z-10">
                <p className="text-[#4c65ad] font-mono text-[9px] mb-1">{group.command}</p>
                <h3 className="text-white font-mono font-bold text-sm mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[10px] font-mono bg-[#7aa2f7]/6 text-[#7dcfff] rounded-md border border-[#7aa2f7]/12 hover:border-[#7aa2f7]/30 hover:bg-[#7aa2f7]/12 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ======================== Stats ======================== */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-4xl font-black font-mono text-[#7dcfff] group-hover:text-[#b8cdfa] transition-colors duration-200">{stat.value}</p>
              <p className="text-gray-600 font-mono text-xs mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
