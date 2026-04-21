"use client"

import { useState } from "react"
import { Send, Mail, MapPin, GitBranch, CheckCircle, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "ashley@kodex-sa.dev",
    href: "mailto:ashley@kodex-sa.dev",
    hint: "Best for project inquiries",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Rustenburg, North West, ZA",
    href: null,
    hint: "Open to remote worldwide",
  },
  {
    icon: GitBranch,
    label: "GitHub",
    value: "github.com/KodEx-SA",
    href: "https://github.com/KodEx-SA",
    hint: "See my open source work",
  },
  // {
  //   icon: Linkedin,
  //   label: "LinkedIn",
  //   value: "linkedin.com/in/ashley-motsie",
  //   href: "https://linkedin.com/in/ashley-motsie",
  //   hint: "Professional networking",
  // },
]

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Wire up to Formspree / EmailJS / server action later
    await new Promise((res) => setTimeout(res, 1400))
    setSent(true)
    setLoading(false)
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            contact.sh
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Get In <span className="text-green-400">Touch</span>
          </h2>
          <div className="w-10 h-0.5 bg-green-500/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <p className="text-gray-400 text-sm leading-relaxed">
                I&apos;m open to new opportunities — remote roles, freelance projects, and collaborations.
                Whether you have a project idea or just want to connect, feel free to reach out.
              </p>
              <p className="text-green-700 font-mono text-xs">
                &gt; avg response time: within 24 hours
              </p>
            </div>

            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contactInfo.map(({ icon: Icon, label, value, href, hint }) => (
                <div
                  key={label}
                  className="group p-3.5 rounded-xl border border-green-500/10 bg-[#080808] hover:border-green-500/25 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-green-500/40 transition-colors">
                      <Icon className="w-3 h-3 text-green-500" />
                    </div>
                    <p className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">{label}</p>
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-300 font-mono text-xs hover:text-green-400 transition-colors group/link"
                    >
                      {value}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="text-gray-300 font-mono text-xs">{value}</p>
                  )}
                  <p className="text-gray-700 font-mono text-[9px] mt-1">{hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="relative">
            <div className="absolute -inset-3 pointer-events-none">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-500/25" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-500/25" />
            </div>

            {sent ? (
              <div className="flex flex-col items-center justify-center gap-5 py-20 text-center bg-[#080808] rounded-xl border border-green-500/10">
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-mono font-bold text-lg">Message sent!</p>
                  <p className="text-gray-500 font-mono text-xs mt-1.5">&gt; I&apos;ll get back to you soon.</p>
                </div>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                  className="text-green-500 font-mono text-xs hover:text-green-300 transition-colors border border-green-500/20 hover:border-green-500/40 px-4 py-2 rounded-lg"
                >
                  send another →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 rounded-xl border border-green-500/10 bg-[#080808]"
              >
                <p className="text-green-600 font-mono text-xs">$ ./send_message.sh</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-black/40 border border-green-500/12 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-300 placeholder:text-gray-800 focus:outline-none focus:border-green-500/35 focus:ring-1 focus:ring-green-500/15 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-black/40 border border-green-500/12 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-300 placeholder:text-gray-800 focus:outline-none focus:border-green-500/35 focus:ring-1 focus:ring-green-500/15 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">Subject</label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="bg-black/40 border border-green-500/12 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-300 placeholder:text-gray-800 focus:outline-none focus:border-green-500/35 focus:ring-1 focus:ring-green-500/15 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 font-mono text-[9px] uppercase tracking-widest">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    className="bg-black/40 border border-green-500/12 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-300 placeholder:text-gray-800 focus:outline-none focus:border-green-500/35 focus:ring-1 focus:ring-green-500/15 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold font-mono gap-2 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_35px_rgba(74,222,128,0.5)] hover:-translate-y-px transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
