import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Code2,
  ExternalLink,
  FileJson2,
  GitCommitHorizontal,
  Play,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import runEvidence from "@/lib/run-evidence.json";

const systemRepository =
  "https://github.com/DLaoLiu/forgeloop-auto-coding-system";
const storeRepository =
  "https://github.com/DLaoLiu/forgeloop-openclaw-store";
const storeApplication =
  "https://dlaoliu.github.io/forgeloop-openclaw-store/";

function eventLabel(type: string) {
  const labels: Record<string, string> = {
    "bootstrap.started": "读取产品需求",
    "bootstrap.completed": "生成架构与任务图",
    "task.started": "启动任务",
    "task.completed": "验证通过并提交",
    "manual-gate.completed": "浏览器人工门禁通过",
    "global-verification.completed": "全局验证通过",
    "loop.finished": "循环完成",
  };
  return labels[type] ?? type;
}

function shortTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export function AutonomyStudio() {
  const { summary, events } = runEvidence;
  const recentEvents = events.slice(-12);
  const completion = Math.round(
    (summary.completedTasks / Math.max(summary.totalTasks, 1)) * 100,
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      <SiteHeader />
      <main>
        <section className="border-b border-slate-800 bg-[#121a2a] text-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff8054]">
                  <CircleDot className="size-3" />
                  Real Codex CLI run evidence
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                  先构建循环系统，
                  <br />
                  再由系统生成应用
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
                  这里展示的不是计时器动画。ForgeLoop 从空 Git
                  工作区读取需求，调用 Codex CLI 逐任务修改文件，由控制器独立运行验证，
                  失败时把结果交回 Agent 修复，验证通过后才允许提交。
                </p>
              </div>
              <div className="grid min-w-[280px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                {[
                  ["任务", `${summary.completedTasks}/${summary.totalTasks}`],
                  ["完成度", `${completion}%`],
                  ["Agent 回合", String(summary.iterations)],
                  ["最终状态", summary.status === "completed" ? "PASSED" : summary.status],
                ].map(([label, value]) => (
                  <div className="bg-[#182235] p-4" key={label}>
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 font-mono text-sm font-bold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-md bg-[#ff6f4b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#f06440]"
                href={storeApplication}
                rel="noreferrer"
                target="_blank"
              >
                查看系统生成的商店
                <ExternalLink className="size-3.5" />
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5"
                href={systemRepository}
                rel="noreferrer"
                target="_blank"
              >
                自动开发系统源码
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:py-12">
          <div className="space-y-6">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e6673f]">
                    Verified task graph
                  </p>
                  <h2 className="mt-1 text-base font-bold">
                    OpenClaw Skill Store 实际任务
                  </h2>
                </div>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </header>
              <ol className="divide-y divide-slate-100">
                {summary.tasks.map((task, index) => (
                  <li
                    className="grid gap-3 px-5 py-4 sm:grid-cols-[32px_minmax(0,1fr)_auto] sm:items-center"
                    key={task.id}
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-emerald-50 font-mono text-[10px] font-bold text-emerald-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{task.title}</p>
                      <p className="mt-1 truncate font-mono text-[10px] text-slate-400">
                        {task.id} · attempt {task.attempts}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                        PASSED
                      </span>
                      <span className="font-mono text-slate-400">
                        {task.commit ?? "commit pending"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Workflow className="size-4 text-[#e6673f]" />
                <h2 className="text-sm font-bold">真实因果链</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [FileJson2, "1. Bootstrap", "需求 → architecture.md + task.json"],
                  [Bot, "2. Codex turn", "一次只实现一个未通过任务"],
                  [ShieldCheck, "3. Controller", "独立执行白名单验证命令"],
                  [GitCommitHorizontal, "4. Evidence", "通过后提交并写入 JSONL"],
                ].map(([Icon, title, text]) => {
                  const ItemIcon = Icon as typeof Workflow;
                  return (
                    <div
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      key={String(title)}
                    >
                      <ItemIcon className="size-4 text-[#e6673f]" />
                      <p className="mt-3 text-xs font-bold">{String(title)}</p>
                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {String(text)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="overflow-hidden rounded-xl border border-slate-800 bg-[#121a2a] text-white shadow-sm">
              <header className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <TerminalSquare className="size-4 text-[#ff8054]" />
                <h2 className="font-mono text-xs font-bold">event stream</h2>
              </header>
              <div className="max-h-[520px] space-y-0.5 overflow-auto p-3 font-mono text-[9px] leading-5">
                {recentEvents.map((event, index) => (
                  <div
                    className="grid grid-cols-[54px_minmax(0,1fr)] gap-2 rounded px-2 py-1.5 hover:bg-white/5"
                    key={`${event.at}-${index}`}
                  >
                    <span className="text-slate-500">{shortTime(event.at)}</span>
                    <span>
                      <span className="text-emerald-400">
                        {eventLabel(event.type)}
                      </span>
                      {"taskId" in event && event.taskId ? (
                        <span className="ml-1 text-slate-400">
                          {String(event.taskId)}
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Play className="size-4 text-[#e6673f]" />
                本地复现
              </h2>
              <div className="mt-4 space-y-2 font-mono text-[10px]">
                {[
                  "npm run agent:bootstrap",
                  "npm run agent:run",
                  "npm run agent:status",
                  "npm run agent:sync",
                ].map((command) => (
                  <code
                    className="block rounded-md bg-slate-950 px-3 py-2 text-slate-200"
                    key={command}
                  >
                    $ {command}
                  </code>
                ))}
              </div>
              <p className="mt-4 text-[10px] leading-5 text-slate-500">
                原始 Codex JSONL、每次验证 stdout/stderr、任务计划和进度记录均保存在
                生成仓库的 <code>.agent/</code> 中。终端默认只输出摘要。
              </p>
            </article>

            <a
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-sm font-bold shadow-sm hover:border-slate-300"
              href={storeRepository}
              rel="noreferrer"
              target="_blank"
            >
              生成应用独立仓库
              <Code2 className="size-4 text-[#e6673f]" />
            </a>
          </aside>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-sm font-bold">所有结论都可回到文件、测试和 Git 历史核对</p>
              <p className="mt-1 text-[10px] text-slate-500">
                看板仅渲染已同步的运行证据，不在浏览器里模拟 Agent 执行。
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-xs font-bold text-[#df613b]"
              href="/architecture"
            >
              查看控制器设计
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
