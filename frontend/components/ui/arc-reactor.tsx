// Decorative arc-reactor ring. Pure SVG + CSS (animations live in globals.css), no client JS.
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5)

export function ArcReactor({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        <radialGradient id="reactor-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e6fbff" />
          <stop offset="0.35" stopColor="#00e5ff" />
          <stop offset="1" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="150" fill="url(#reactor-core)" opacity="0.12" />

      <g stroke="#00e5ff">
        <g className="reactor-cw" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="190" strokeWidth="1" strokeDasharray="3 12" opacity="0.6" />
        </g>
        <g className="reactor-ccw" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="165" strokeWidth="3" strokeDasharray="90 30 12 30" opacity="0.8" />
        </g>
        <g className="reactor-cw-fast" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="138" strokeWidth="1.5" strokeDasharray="2 8" opacity="0.7" />
        </g>
        <circle cx="200" cy="200" r="108" strokeWidth="2" opacity="0.85" />

        {/* degree ticks */}
        <g strokeWidth="1" opacity="0.55">
          {TICKS.map((deg) => (
            <line
              key={deg}
              x1="200"
              y1={deg % 15 === 0 ? 84 : 88}
              x2="200"
              y2="94"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </g>
      </g>

      {/* cross-hair bars */}
      <g fill="#00e5ff" opacity="0.8">
        <rect x="197" y="150" width="6" height="22" />
        <rect x="197" y="228" width="6" height="22" />
        <rect x="150" y="197" width="22" height="6" />
        <rect x="228" y="197" width="22" height="6" />
      </g>

      <circle className="reactor-core" cx="200" cy="200" r="26" fill="url(#reactor-core)" />
    </svg>
  )
}
