"use client";

import {
  ArrowDownToLine,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Clipboard,
  Code2,
  Download,
  FileCode2,
  Filter,
  GitFork,
  Info,
  PackageCheck,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  categories,
  skillManifest,
  skills,
  type Skill,
} from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillStore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [selected, setSelected] = useState<Skill | null>(null);
  const [installing, setInstalling] = useState<Skill | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return skills.filter((skill) => {
      const categoryMatch =
        category === "全部" || skill.category === category;
      const searchMatch =
        !normalized ||
        [skill.name, skill.slug, skill.description, skill.author]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  function confirmInstall(skill: Skill) {
    setInstalled((items) =>
      items.includes(skill.id) ? items : [...items, skill.id],
    );
    setInstalling(null);
  }

  async function copyCommand(skill: Skill) {
    await navigator.clipboard.writeText(`openclaw skills install ${skill.slug}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <SiteHeader />
      <main>
        <section className="noise overflow-hidden border-b border-slate-800 bg-[#172033] text-white">
          <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_420px] lg:items-center lg:py-20">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                <Sparkles className="size-3 text-[#ff8054]" />
                官方格式 · 开源可审计 · 一键安装
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
                为你的 OpenClaw
                <br />
                装上新的<span className="text-[#ff7b4d]">能力</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                发现经过安全检查的 Agent Skill。先审查权限，再用一条命令安装。
              </p>
              <div className="mt-7 flex max-w-2xl items-center rounded-lg border border-white/10 bg-white p-1.5 shadow-2xl shadow-black/20">
                <Search className="ml-3 size-4 shrink-0 text-slate-400" />
                <label className="sr-only" htmlFor="skill-search">
                  搜索 Skill
                </label>
                <input
                  className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  id="skill-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索 Skill、作者或能力…"
                  value={query}
                />
                <span className="hidden rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] text-slate-400 sm:inline">
                  {filtered.length} results
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  安装前安全扫描
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="size-3 text-blue-400" />
                  SKILL.md 完全公开
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3 text-amber-400" />
                  支持 OpenClaw CLI
                </span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rotate-1 rounded-xl border border-white/10 bg-[#0e1626] p-4 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-[#ff6b5f]" />
                    <span className="size-2 rounded-full bg-[#f0bf4c]" />
                    <span className="size-2 rounded-full bg-[#3fc37c]" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-500">
                    openclaw · terminal
                  </span>
                </div>
                <div className="space-y-3 font-mono text-[11px] leading-5">
                  <p className="text-slate-400">
                    <span className="text-emerald-400">$</span> openclaw skills
                    install @clawlab/github-pilot
                  </p>
                  <p className="text-slate-500">→ Fetching skill manifest...</p>
                  <p className="text-slate-500">→ Verifying trust envelope...</p>
                  <p className="text-slate-500">→ Reviewing permissions...</p>
                  <p className="flex items-center gap-2 text-emerald-400">
                    <Check className="size-3" />
                    github-pilot v2.4.1 installed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-slate-100 px-5 sm:grid-cols-4 sm:px-8">
            {[
              ["8+", "精选 Skills", PackageCheck],
              ["100%", "源码可审计", Code2],
              ["12", "安全检查项", ShieldCheck],
              ["< 60s", "完成安装", Zap],
            ].map(([value, label, Icon]) => {
              const StatIcon = Icon as typeof PackageCheck;
              return (
                <div
                  className="flex items-center justify-center gap-3 px-3 py-5"
                  key={String(label)}
                >
                  <StatIcon className="hidden size-4 text-[#ee7047] sm:block" />
                  <div>
                    <p className="text-base font-bold">{String(value)}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      {String(label)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:py-14">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#e66c45]">
                <TrendingUp className="size-3.5" />
                Curated marketplace
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                探索热门 Skill
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                所有条目均展示版本、权限边界与安全状态。
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="mr-1 size-3.5 shrink-0 text-slate-400" />
              {categories.map((item) => (
                <button
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-[10px] font-bold transition",
                    category === item
                      ? "bg-[#172033] text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                  )}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filtered.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((skill) => {
                const isInstalled = installed.includes(skill.id);
                return (
                  <article
                    className="group flex min-h-[270px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(23,32,51,0.035)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_32px_rgba(23,32,51,0.08)]"
                    key={skill.id}
                  >
                    <div className="flex items-start justify-between">
                      <button
                        aria-label={`查看 ${skill.name} 详情`}
                        className="grid size-11 place-items-center rounded-xl font-mono text-sm font-bold text-white shadow-sm"
                        onClick={() => setSelected(skill)}
                        style={{ backgroundColor: skill.accent }}
                      >
                        {skill.icon}
                      </button>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold",
                          skill.risk === "中风险"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {skill.risk === "已验证" ? (
                          <BadgeCheck className="size-3" />
                        ) : (
                          <Shield className="size-3" />
                        )}
                        {skill.risk}
                      </span>
                    </div>
                    <button
                      className="mt-4 text-left"
                      onClick={() => setSelected(skill)}
                    >
                      <h3 className="flex items-center gap-1.5 text-base font-bold group-hover:text-[#e5673f]">
                        {skill.name}
                        <ChevronRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                      </h3>
                      <p className="mt-1 font-mono text-[9px] text-slate-400">
                        {skill.slug} · v{skill.version}
                      </p>
                    </button>
                    <p className="mt-3 flex-1 text-[11px] leading-5 text-slate-500">
                      {skill.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 text-[9px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Download className="size-3" />
                        {skill.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {skill.rating}
                      </span>
                      <span className="ml-auto">{skill.author}</span>
                    </div>
                    <button
                      className={cn(
                        "mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md text-[10px] font-bold transition",
                        isInstalled
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "bg-[#172033] text-white hover:bg-[#27334a]",
                      )}
                      disabled={isInstalled}
                      onClick={() => setInstalling(skill)}
                    >
                      {isInstalled ? (
                        <>
                          <CircleCheck className="size-3.5" />
                          已安装
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="size-3.5" />
                          审查并安装
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <Search className="mx-auto size-6 text-slate-300" />
              <h3 className="mt-4 text-sm font-bold">未找到匹配的 Skill</h3>
              <p className="mt-2 text-xs text-slate-400">
                尝试更换关键词或选择“全部”分类。
              </p>
              <button
                className="mt-4 text-xs font-bold text-[#e5673f]"
                onClick={() => {
                  setQuery("");
                  setCategory("全部");
                }}
              >
                清除筛选
              </button>
            </div>
          )}
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
                <ShieldCheck className="size-4" />
                Trust by design
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                权限透明，安装可控
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-6 text-slate-500">
                每个 Skill 安装前都展示来源、权限和验证状态。第三方代码默认视为不可信，只在最小权限下执行。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [GitFork, "来源验证", "绑定公开仓库与版本提交"],
                [FileCode2, "清单检查", "权限声明与实现一致"],
                [ShieldCheck, "隔离执行", "风险工具进入人工审批"],
              ].map(([Icon, title, text]) => {
                const TrustIcon = Icon as typeof GitFork;
                return (
                  <div
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    key={String(title)}
                  >
                    <TrustIcon className="size-4 text-[#e6673f]" />
                    <h3 className="mt-3 text-xs font-bold">{String(title)}</h3>
                    <p className="mt-2 text-[10px] leading-4 text-slate-500">
                      {String(text)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-[2px]"
          role="dialog"
        >
          <button
            aria-label="关闭详情"
            className="absolute inset-0"
            onClick={() => setSelected(null)}
          />
          <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
              <span className="text-xs font-bold">Skill 详情</span>
              <button
                aria-label="关闭详情"
                className="grid size-8 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                onClick={() => setSelected(null)}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <span
                  className="grid size-14 shrink-0 place-items-center rounded-xl font-mono text-base font-bold text-white"
                  style={{ backgroundColor: selected.accent }}
                >
                  {selected.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">
                    {selected.slug} · v{selected.version}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {selected.rating} ({selected.reviews})
                    </span>
                    <span>{selected.downloads} installs</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                {selected.longDescription}
              </p>

              <h3 className="mt-7 text-xs font-bold">请求权限</h3>
              <div className="mt-3 space-y-2">
                {selected.permissions.map((permission) => (
                  <div
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-[11px]"
                    key={permission}
                  >
                    <Shield className="size-3.5 text-emerald-600" />
                    {permission}
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <h3 className="text-xs font-bold">SKILL.md</h3>
                <span className="font-mono text-[9px] text-slate-400">
                  OpenClaw compatible
                </span>
              </div>
              <pre className="scrollbar-thin mt-3 max-h-80 overflow-auto rounded-xl bg-[#121b2b] p-4 font-mono text-[10px] leading-5 text-slate-300">
                {skillManifest(selected)}
              </pre>

              <button
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#172033] text-xs font-bold text-white hover:bg-[#27334a]"
                onClick={() => {
                  setInstalling(selected);
                  setSelected(null);
                }}
              >
                <ArrowDownToLine className="size-4" />
                审查并安装
              </button>
            </div>
          </div>
        </div>
      )}

      {installing && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="size-4 text-emerald-600" />
                安装前确认
              </h2>
              <button
                aria-label="取消安装"
                className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
                onClick={() => setInstalling(null)}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-lg font-mono text-xs font-bold text-white"
                  style={{ backgroundColor: installing.accent }}
                >
                  {installing.icon}
                </span>
                <div>
                  <p className="text-sm font-bold">{installing.name}</p>
                  <p className="font-mono text-[9px] text-slate-400">
                    {installing.slug} · v{installing.version}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-emerald-50 p-3">
                <p className="flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                  <CircleCheck className="size-3.5" />
                  12 项安全检查已通过
                </p>
                <p className="mt-1.5 text-[9px] leading-4 text-emerald-700">
                  来源、版本、权限声明和依赖均已验证。第三方 Skill 仍应视为不可信代码。
                </p>
              </div>

              <p className="mt-5 text-[10px] font-bold text-slate-700">
                此 Skill 将获得：
              </p>
              <ul className="mt-2 space-y-2">
                {installing.permissions.map((permission) => (
                  <li
                    className="flex items-center gap-2 text-[10px] text-slate-500"
                    key={permission}
                  >
                    <Check className="size-3 text-emerald-600" />
                    {permission}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <Terminal className="ml-1 size-3.5 shrink-0 text-slate-400" />
                <code className="min-w-0 flex-1 truncate font-mono text-[9px] text-slate-600">
                  openclaw skills install {installing.slug}
                </code>
                <button
                  aria-label="复制安装命令"
                  className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-slate-500 shadow-sm"
                  onClick={() => copyCommand(installing)}
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Clipboard className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-4">
              <button
                className="rounded-md border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                onClick={() => setInstalling(null)}
              >
                取消
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#172033] px-4 py-2.5 text-[10px] font-bold text-white hover:bg-[#27334a]"
                onClick={() => confirmInstall(installing)}
              >
                <PackageCheck className="size-3.5" />
                确认安装
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800 bg-[#111827] text-slate-400">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-7 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>ForgeLoop generated · OpenClaw Skill Store Demo</p>
          <a
            className="inline-flex items-center gap-1.5 hover:text-white"
            href="https://docs.openclaw.ai/clawhub/skill-format"
            rel="noreferrer"
            target="_blank"
          >
            <Info className="size-3" />
            OpenClaw Skill Format
            <ArrowRight className="size-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
