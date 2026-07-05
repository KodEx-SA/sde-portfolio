"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  Tag,
  ArrowUpRight,
  Terminal,
  Calendar,
} from "lucide-react";

// =================================== Types ===================================

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  tags: string[];
  category: string;
}

// =================================== Blog data ===================================

const POSTS: Post[] = [
  {
    slug: "streaming-ai-chatbot-groq-nextjs",
    title: "Building a Streaming AI Chatbot with Groq & Next.js",
    excerpt:
      "How I built Smith - a sub-second streaming chatbot using the Groq API, Next.js App Router server-sent events, and a hand-rolled ReadableStream. No SDK, no bloat.",
    date: "2025-04-18",
    readTime: 7,
    tags: ["AI", "Next.js", "Groq", "Streaming"],
    category: "Tutorial",
  },
  {
    slug: "turborepo-monorepo-nextjs-expo",
    title: "Turborepo Monorepo: Next.js + Expo in One Repo",
    excerpt:
      "Setting up a Turborepo monorepo with a Next.js web app and Expo mobile app sharing the same Supabase backend, TypeScript types, and UI component library.",
    date: "2025-03-30",
    readTime: 9,
    tags: ["Turborepo", "Next.js", "Expo", "Supabase"],
    category: "Architecture",
  },
  {
    slug: "linux-mint-dev-environment",
    title: "My Full Linux Mint XFCE Dev Setup in 2025",
    excerpt:
      "NVM, zsh, Oh My Zsh, Starship prompt, Docker, VS Code extensions, and all the CLI tools that made my Acer A315 feel like a proper dev machine.",
    date: "2025-02-14",
    readTime: 6,
    tags: ["Linux", "DevOps", "CLI", "zsh"],
    category: "Setup",
  },
  {
    slug: "supabase-rls-multi-tenant",
    title: "Supabase RLS for Multi-Tenant Apps - Property Manager Case Study",
    excerpt:
      "Real-world Row Level Security policies for a four-role property management platform: Super Admin, Property Manager, Tenant, and Maintenance Tech. Lessons from building it.",
    date: "2025-01-22",
    readTime: 8,
    tags: ["Supabase", "PostgreSQL", "RLS", "Auth"],
    category: "Deep Dive",
  },
  {
    slug: "nextjs-portfolio-rebuild",
    title: "Rebuilding My Portfolio in Next.js: Before vs After",
    excerpt:
      "Why I migrated from plain React + Vite to Next.js 16, added Smith the chatbot, ditched Netlify for Vercel, and what performance gains I picked up along the way.",
    date: "2024-12-05",
    readTime: 5,
    tags: ["Next.js", "Portfolio", "Performance"],
    category: "Project Log",
  },
  {
    slug: "groq-livekit-voice-assistant",
    title: "Debugging a LiveKit Voice Assistant with Groq + Deepgram",
    excerpt:
      "Building Clare - an AI voice assistant — and the wild ride of swapping STT/TTS providers when OpenAI quotas ran dry. Real issues, real fixes.",
    date: "2024-11-11",
    readTime: 10,
    tags: ["AI", "LiveKit", "Deepgram", "Voice"],
    category: "Project Log",
  },
];

const ALL_TAGS = Array.from(new Set(POSTS.flatMap((p) => p.tags)));
const ALL_CATEGORIES = [
  "All",
  ...Array.from(new Set(POSTS.map((p) => p.category))),
];

const CATEGORY_COLORS: Record<string, string> = {
  Tutorial: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  Architecture: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  Setup: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  "Deep Dive": "text-orange-400 border-orange-500/20 bg-orange-500/5",
  "Project Log": "text-green-400 border-green-500/20 bg-green-500/5",
};

// =================================== Helpers ===================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-600 border border-green-500/20 bg-green-500/5 rounded-md px-2.5 py-1 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      {children}
    </span>
  );
}

// =================================== PostCard ===================================

function PostCard({ post }: { post: Post }) {
  const catClass =
    CATEGORY_COLORS[post.category] ??
    "text-gray-400 border-gray-500/20 bg-gray-500/5";

  return (
    <article className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-green-500/10 bg-[#0a0a0a] hover:border-green-500/25 hover:bg-[#0f0f0f] transition-all duration-300 hover:shadow-[0_0_32px_rgba(74,222,128,0.04)] cursor-pointer">
      {/* ======================== Terminal window dots ======================== */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500/50" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <span className="w-2 h-2 rounded-full bg-green-500/50" />
        <span className="ml-2 font-mono text-[9px] text-gray-700">
          {post.slug}.mdx
        </span>

        {/* ======================== Category badge - pushed right ======================== */}
        <span
          className={`ml-auto text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${catClass}`}
        >
          {post.category}
        </span>
      </div>

      {/* ======================== Title ======================== */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-sm font-bold text-gray-200 group-hover:text-green-300 transition-colors leading-snug">
          <span className="text-green-600 mr-1.5 text-xs select-none">›</span>
          {post.title}
        </h3>
        <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-500 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {/* ======================== Excerpt ======================== */}
      <p className="font-mono text-[11px] text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {post.excerpt}
      </p>

      {/* ======================== Tags ======================== */}
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border border-green-500/10 bg-green-500/5 text-green-700"
          >
            <Tag className="w-2 h-2" />
            {tag}
          </span>
        ))}
      </div>

      {/* ======================== Footer ======================== */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
          <Calendar className="w-3 h-3" />
          {formatDate(post.date)}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-700 font-mono">
          <Clock className="w-3 h-3" />
          {post.readTime} min read
        </span>
      </div>
    </article>
  );
}

// =================================== Main Component ===================================

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = POSTS.filter((p) => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const tagMatch = !activeTag || p.tags.includes(activeTag);
    return catMatch && tagMatch;
  });

  return (
    <section id="blog" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* ======================== Subtle dot grid ======================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(rgba(74,222,128,0.04)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 flex flex-col gap-12">
        {/* ======================== Section header ======================== */}
        <div className="flex flex-col gap-4">
          <SectionLabel>dev.blog</SectionLabel>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-mono text-white leading-tight">
                Dev <span className="text-green-400">Notes</span>
              </h2>
              <p className="text-gray-600 font-mono text-sm mt-2">
                <span className="text-green-700">$</span> ls -la ./writings -
                tutorials, project logs & deep dives
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/15 bg-[#0a0a0a]">
              <Terminal className="w-3.5 h-3.5 text-green-600" />
              <span className="font-mono text-[10px] text-gray-600">
                {POSTS.length} posts total
              </span>
            </div>
          </div>
        </div>

        {/* ======================== Category filter ======================== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-gray-700 mr-1">
              category:
            </span>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveTag(null);
                }}
                className={`font-mono text-[10px] px-2.5 py-1 rounded-lg border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-green-500 text-black border-green-500 font-bold"
                    : "border-green-500/15 text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-gray-700 mr-1">
              tag:
            </span>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full border transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-green-500/20 text-green-300 border-green-500/40"
                    : "border-green-500/10 text-gray-600 hover:text-green-500 hover:border-green-500/25"
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ======================== Posts grid ======================== */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FileText className="w-8 h-8 text-gray-800" />
            <p className="font-mono text-xs text-gray-700">
              No posts match that filter.{" "}
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setActiveTag(null);
                }}
                className="text-green-600 underline underline-offset-2"
              >
                Reset filters
              </button>
            </p>
          </div>
        )}

        {/* ======================== Coming soon notice ======================== */}
        <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-green-500/10 bg-[#0a0a0a]">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 font-semibold">
              More posts coming soon
            </p>
            <p className="font-mono text-[10px] text-gray-700 mt-0.5">
              Currently shipping - will publish more notes as projects wrap up.
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            drafting
          </span>
        </div>
      </div>
    </section>
  );
}
