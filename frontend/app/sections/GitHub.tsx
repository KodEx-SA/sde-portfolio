"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import {
  Star,
  GitFork,
  ExternalLink,
  Users,
  BookOpen,
  GitCommitHorizontal,
  Activity,
  Code2,
  Flame,
  Clock,
  ChevronRight,
} from "lucide-react";

// =================================== Types ===================================

interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
}

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

// =================================== Constants ===================================

const USERNAME = "KodEx-SA";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8",
};

// =================================== Helpers ===================================

function timeAgo(dateStr: string) {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

// =================================== Sub-components ===================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-500 text-xs font-mono w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border text-center overflow-hidden group transition-all duration-300 ${
        highlight
          ? "border-brand-500/35 bg-brand-500/8 shadow-[0_0_20px_rgba(125,207,255,0.06)]"
          : "border-brand-500/10 bg-[#0a0a0a] hover:border-brand-500/25 hover:bg-[#0f0f0f]"
      }`}
    >
      <span className="absolute inset-0 bg-brand-500/4 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-1 relative z-10">
        <Icon className="w-4 h-4 text-brand-400" />
      </div>
      <span className="font-mono text-lg font-bold text-white relative z-10">
        {value}
      </span>
      <span className="font-mono text-[10px] text-brand-600 font-semibold uppercase tracking-widest relative z-10">
        {label}
      </span>
      {sub && (
        <span className="font-mono text-[9px] text-gray-700 relative z-10">
          {sub}
        </span>
      )}
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const langColor = repo.language
    ? (LANG_COLORS[repo.language] ?? "#6b7280")
    : null;

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col gap-3 p-4 rounded-xl border border-brand-500/10 bg-[#0a0a0a] hover:border-brand-500/30 hover:bg-[#0f0f0f] transition-all duration-300 hover:shadow-[0_0_24px_rgba(125,207,255,0.05)]"
    >
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-500/0 group-hover:border-brand-500/40 rounded-tl-xl transition-all duration-300" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-500/0 group-hover:border-brand-500/40 rounded-br-xl transition-all duration-300" />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span className="font-mono text-xs font-semibold text-gray-300 group-hover:text-brand-300 transition-colors truncate">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3 h-3 text-gray-700 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      <p className="text-[11px] text-gray-600 font-mono leading-relaxed line-clamp-2 flex-1">
        {repo.description ?? "No description provided."}
      </p>

      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-brand-500/15 bg-brand-500/5 text-brand-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        {langColor ? (
          <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
            <GitFork className="w-3 h-3" />
            {repo.forks_count}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-700 font-mono">
            <Clock className="w-3 h-3" />
            {timeAgo(repo.updated_at)}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// =================================== Main Component ===================================

export default function GitHub({ username = USERNAME }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [chartError, setChartError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1. User profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("user fetch failed");
        const userData: GitHubUser = await userRes.json();
        if (cancelled) return;

        // 2. Repos - public, non-fork, sorted by recently updated
        let reposData: Repo[] = [];
        try {
          const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=9&type=public`,
          );
          if (reposRes.ok) {
            const json: Repo[] = await reposRes.json();
            reposData = json.filter((r) => !r.fork).slice(0, 6);
          }
        } catch {/* silent */}
        if (cancelled) return;

        setUser(userData);
        setRepos(reposData);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const uniqueLangs = new Set(repos.map((r) => r.language).filter(Boolean))
    .size;

  return (
    <section
      id="github"
      className="relative py-24 md:py-32 px-6 md:px-20 overflow-hidden bg-[#040404]"
    >
      {/* ======================== Grid texture ======================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(122,162,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(122,162,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
      />
      {/* ======================== Glow ======================== */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/3 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-14">
        {/* ======================== Section header ======================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <SectionLabel>github.activity</SectionLabel>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-mono text-white leading-tight">
                Code <span className="text-brand-400">Activity</span>
              </h2>
              <div className="w-10 h-0.5 bg-brand-500/50 mt-3" />
              <p className="text-gray-600 font-mono text-sm mt-3">
                <span className="text-brand-700">$</span> git log --all
                --oneline &nbsp;—&nbsp; live data from the GitHub API
              </p>
            </div>

            {/* ======================== Profile pill ======================== */}
            {user && (
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-brand-500/15 bg-[#0a0a0a] hover:border-brand-500/35 hover:bg-brand-500/5 transition-all duration-200 group"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-500/25 flex-shrink-0">
                  <Image
                    src={user.avatar_url}
                    alt={username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-left">
                  <p className="font-mono text-xs font-semibold text-gray-300 group-hover:text-brand-300 transition-colors">
                    @{username}
                  </p>
                  {user.bio && (
                    <p className="font-mono text-[9px] text-gray-700 max-w-[180px] truncate">
                      {user.bio}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 text-gray-700 group-hover:text-brand-500 transition-colors flex-shrink-0" />
              </a>
            )}
          </div>
        </motion.div>

        {/* ======================== Skeleton ======================== */}
        {loading && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-brand-500/5 border border-brand-500/8 animate-pulse"
                />
              ))}
            </div>
            <div className="h-36 rounded-2xl bg-brand-500/5 border border-brand-500/8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-brand-500/5 border border-brand-500/8 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* ======================== Error ======================== */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 border border-brand-500/10 rounded-2xl bg-[#0a0a0a]">
            <FaGithub className="w-8 h-8 text-gray-700" />
            <p className="font-mono text-xs text-gray-600">
              Could not reach GitHub API.{" "}
              <a
                href={`https://github.com/${username}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline underline-offset-2 hover:text-brand-400"
              >
                View profile on GitHub →
              </a>
            </p>
          </div>
        )}

        {/* ======================== Main content ======================== */}
        {!loading && !error && user && (
          <>
            {/* ======================== Primary stat cards ======================== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard
                icon={BookOpen}
                label="Public Repos"
                value={user.public_repos}
                sub="owned"
              />
              <StatCard
                icon={Users}
                label="Followers"
                value={user.followers}
                sub={`following ${user.following}`}
              />
              <StatCard
                icon={GitCommitHorizontal}
                label="Total Commits"
                value="1.1k+"
                sub="across all repos"
                highlight
              />
              <StatCard
                icon={Star}
                label="Total Stars"
                value={totalStars}
                sub={`${totalForks} forks`}
              />
            </motion.div>

            {/* ======================== Secondary strip ======================== */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Flame, label: "Active Contributor", value: "2025" },
                { icon: Activity, label: "Commit Streak", value: "Consistent" },
                {
                  icon: Code2,
                  label: "Languages Used",
                  value: `${uniqueLangs}+`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 p-3 rounded-xl border border-brand-500/8 bg-[#0a0a0a]"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-white">
                      {s.value}
                    </p>
                    <p className="font-mono text-[9px] text-gray-600">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ======================== Contribution graph ======================== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <SectionLabel>contribution.graph</SectionLabel>
              <div className="p-4 md:p-6 rounded-2xl border border-brand-500/10 bg-[#0a0a0a] overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <GitCommitHorizontal className="w-3.5 h-3.5 text-brand-500/60" />
                  <span className="font-mono text-[10px] text-gray-600">
                    contributions — past 12 months
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-brand-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    live
                  </span>
                </div>

                {chartError ? (
                  <div className="flex items-center justify-center h-24 text-gray-700 font-mono text-xs">
                    Chart unavailable —{" "}
                    <a
                      href={`https://github.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-brand-700 underline underline-offset-2"
                    >
                      view on GitHub
                    </a>
                  </div>
                ) : (
                  <Image
                    src={`https://ghchart.rshah.org/22c55e/${username}`}
                    alt={`${username} GitHub contribution graph`}
                    width={900}
                    height={130}
                    className="w-full h-auto rounded-lg opacity-85"
                    unoptimized
                    onError={() => setChartError(true)}
                  />
                )}
              </div>
            </motion.div>

            {/* ======================== Repos ======================== */}
            {repos.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <SectionLabel>repos.recently-updated</SectionLabel>
                  <a
                    href={`https://github.com/${username}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-[10px] text-gray-600 hover:text-brand-400 transition-colors"
                  >
                    View all <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
