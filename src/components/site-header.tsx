"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Braces,
  ExternalLink,
  GitFork,
  Store,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "自主开发系统", icon: Workflow },
  { href: "/store", label: "Skill 商店", icon: Store },
  { href: "/architecture", label: "系统说明", icon: Braces },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-5 px-4 sm:px-6">
        <Link className="flex shrink-0 items-center gap-2.5" href="/">
          <span className="grid size-8 place-items-center rounded-lg bg-[#172033] text-white shadow-sm">
            <Boxes className="size-4" />
          </span>
          <span className="text-[15px] font-bold tracking-tight">
            Forge<span className="text-[#f56a3f]">Loop</span>
          </span>
          <span className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-500 sm:inline">
            DEMO
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold transition sm:px-3",
                  active
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <a
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          href="https://github.com/DLaoLiu/forgeloop-openclaw-store"
          rel="noreferrer"
          target="_blank"
          title="查看 GitHub 源码"
        >
          <GitFork className="size-3.5" />
          <span className="hidden lg:inline">GitHub</span>
          <ExternalLink className="hidden size-3 text-slate-400 lg:block" />
        </a>
      </div>
    </header>
  );
}
