import { ArrowLeft, ExternalLink, GitFork } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#e6673f]">
          Separate generated repository
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Skill 商店由 ForgeLoop
          <br />
          在空仓库中生成
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500">
          为保留清晰的因果链和独立 Git 历史，业务应用不再内嵌于自动开发系统仓库。
          请访问生成应用的 GitHub Pages 或查看其任务、测试与自动化证据。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-md bg-[#172033] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#27334a]"
            href="https://dlaoliu.github.io/forgeloop-openclaw-store/"
            rel="noreferrer"
            target="_blank"
          >
            打开 OpenClaw Skill Store
            <ExternalLink className="size-4" />
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            href="https://github.com/DLaoLiu/forgeloop-openclaw-store"
            rel="noreferrer"
            target="_blank"
          >
            <GitFork className="size-4" />
            查看生成仓库
          </a>
        </div>
        <Link
          className="mt-10 inline-flex items-center gap-2 text-xs font-bold text-[#df613b]"
          href="/"
        >
          <ArrowLeft className="size-3.5" />
          返回真实运行证据
        </Link>
      </main>
    </div>
  );
}
