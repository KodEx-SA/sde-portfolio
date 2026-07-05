"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return

    fetch(`${apiUrl}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pageview", path: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
