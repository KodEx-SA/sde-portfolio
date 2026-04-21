import { Terminal, GitBranch, Mail, MapPin, ArrowUpRight } from "lucide-react"

const quickLinks = [
  { label: "home", href: "#hero" },
  { label: "about", href: "#about" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
  { label: "achievements", href: "#achievements" },
  { label: "contact", href: "#contact" },
]

const techStack = ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Framer Motion", "shadcn/ui", "Magic UI"]

const socials = [
  { label: "GitHub", href: "https://github.com/KodEx-SA", icon: GitBranch },
  { label: "Email", href: "mailto:ashley@kodex-sa.dev", icon: Mail },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-green-500/10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      <div className="absolute bottom-0 right-0 text-[12vw] font-black font-mono text-green-500/[0.02] leading-none select-none pointer-events-none">AM</div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-20 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
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
              <MapPin className="w-3 h-3 text-green-800" />
              Rustenburg, North West, ZA
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-600 font-mono text-[10px]">open to work</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ ls pages/</p>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a key={link.label} href={link.href}
                  className="group flex items-center gap-1.5 text-gray-600 hover:text-green-400 font-mono text-xs transition-colors duration-200">
                  <span className="text-green-900 group-hover:text-green-700 transition-colors text-[10px]">/</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Stack */}
          <div className="flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ cat stack.txt</p>
            <div className="flex flex-col gap-2">
              {techStack.map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-800" />
                  <span className="text-gray-700 font-mono text-xs">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <p className="text-green-700 font-mono text-[9px] uppercase tracking-widest">$ connect --me</p>
            <div className="flex flex-col gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-gray-600 hover:text-green-400 font-mono text-xs transition-all duration-200">
                  <div className="w-6 h-6 rounded-md bg-green-500/6 border border-green-500/12 flex items-center justify-center group-hover:border-green-500/35 group-hover:bg-green-500/12 transition-all duration-200">
                    <Icon className="w-3 h-3" />
                  </div>
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              ))}
              <a
                href="/assets/resume/Ashley_K_Motsie_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 px-4 py-2 text-center text-xs font-mono font-bold bg-green-500/8 border border-green-500/20 text-green-500 rounded-lg hover:bg-green-500/15 hover:border-green-500/40 transition-all duration-200"
              >
                resume.pdf
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative h-px w-full mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-800 font-mono text-[10px]">&copy; {year} Ashley K Motsie · All rights reserved</p>
          <div className="flex items-center gap-2 text-gray-800 font-mono text-[10px]">
            <span>crafted with</span>
            <span className="text-green-900">♥</span>
            <span>in rustenburg, za</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
