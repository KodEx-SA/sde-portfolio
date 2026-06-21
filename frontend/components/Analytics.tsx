"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Fires a fire-and-forget pageview event to the standalone backend
 * whenever the path changes. Silently no-ops if NEXT_PUBLIC_API_URL
 * isn't set or the request fails - analytics should never break the page.
 */
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return

    fetch(`${apiUrl}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pageview", path: pathname }),
    }).catch(() => {
      // Intentionally ignored - analytics failures shouldn't surface to visitors.
    })
  }, [pathname])

  return null
}
