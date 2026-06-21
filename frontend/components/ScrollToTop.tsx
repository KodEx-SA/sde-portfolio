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
      className="fixed bottom-22 right-6 z-40 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-500 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
