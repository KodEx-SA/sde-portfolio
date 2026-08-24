"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-22 right-6 z-40 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-[#7aa2f7]/30 text-[#7dcfff] hover:bg-[#7aa2f7] hover:text-black hover:border-[#7aa2f7] hover:shadow-[0_0_20px_rgba(125,207,255,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
