"use client"

import Image from "next/image"
import { useState } from "react"
import { X, Award, ZoomIn } from "lucide-react"

const certificates = [
  {
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    year: "2024",
    image: "/assets/certificates/cert-cybersecurity.jpeg",
    description: "Foundations of cybersecurity including network security, threats, and defensive strategies.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Get Connected",
    issuer: "Cisco Networking Academy",
    year: "2024",
    image: "/assets/certificates/cert-get-connected.jpeg",
    description: "Introduction to digital literacy, internet connectivity, and device networking fundamentals.",
    color: "from-green-500/20 to-emerald-500/10",
  },
  {
    title: "IT Essentials",
    issuer: "Cisco Networking Academy",
    year: "2024",
    image: "/assets/certificates/cert-it-essentials.jpeg",
    description: "PC hardware and software fundamentals, troubleshooting methodology, and IT support skills.",
    color: "from-teal-500/20 to-green-500/10",
  },
  {
    title: "IT & Computer Sciences",
    issuer: "Orbit TVET College",
    year: "2023",
    image: "/assets/certificates/cert-it-completion.jpeg",
    description: "NCV National Certificate in Information Technology and Computer Sciences — Level 4.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
]

export default function Achievements() {
  const [selected, setSelected] = useState<typeof certificates[0] | null>(null)

  return (
    <section id="achievements" className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            achievements.log
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono">
            Certifications &amp; <span className="text-green-400">Awards</span>
          </h2>
          <div className="w-10 h-0.5 bg-green-500/50" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certificates.map((cert, i) => (
            <button
              key={i}
              onClick={() => setSelected(cert)}
              className="group text-left rounded-xl border border-green-500/10 bg-[#080808] hover:border-green-500/30 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500/30 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />

                {/* Hover zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-green-500/30 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-green-400" />
                  </div>
                </div>

                {/* Award badge */}
                <div className="absolute top-2.5 right-2.5">
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-green-500/30 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-green-700 font-mono text-[9px] mb-1.5">{cert.year} · {cert.issuer}</p>
                <h3 className="text-white font-mono font-bold text-xs group-hover:text-green-400 transition-colors duration-200 leading-snug mb-2">
                  {cert.title}
                </h3>
                <p className="text-gray-700 font-mono text-[10px] leading-relaxed line-clamp-2">
                  {cert.description}
                </p>
                <p className="text-green-800 font-mono text-[9px] mt-3 group-hover:text-green-600 transition-colors">
                  click to enlarge →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-xl w-full bg-[#080808] rounded-2xl border border-green-500/20 overflow-hidden shadow-[0_0_80px_rgba(74,222,128,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Image */}
            <div className="relative h-64 sm:h-80 w-full bg-black">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Info */}
            <div className="p-5 border-t border-green-500/10">
              <p className="text-green-600 font-mono text-[10px] mb-1.5">{selected.issuer} · {selected.year}</p>
              <h3 className="text-white font-mono font-bold text-base">{selected.title}</h3>
              <p className="text-gray-500 font-mono text-xs mt-2 leading-relaxed">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
