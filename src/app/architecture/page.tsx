import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Database,
  GitPullRequest,
  PlayCircle,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const stages = [
  ["01", "Discover", "需求与约束", "将自然语言目标转为可测试的验收标准。"],
  ["02", "Architect", "架构与任务图", "生成依赖图、风险清单和执行计划。"],
  ["03", "Build", "编码与产物", "按任务图实现功能并持续记录变更。"],
  ["04", "Verify", "测试与修复", "执行质量门禁，失败后自动定位并重试。"],
  ["05", "Approve", "工程师确认", "只在外部写操作和高风险决策前暂停。"],
  ["06", "Release", "版本与部署", "生成提交、部署产物和可追踪访问地址。"],
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <SiteHeader />
      <main>
        <section className="border-b border-slate-800 bg-[#172033] text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff8054]">
              System design / v1.0
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
              可观察、可恢复、可干预的
              <br />
              AI 自主开发闭环
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
              ForgeLoop
              将模型能力、执行工具和安全策略分离。代理自主推进工作，策略引擎控制权限，所有关键产物与决策都有审计记录。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-100"
                href="/"
              >
                <PlayCircle className="size-4" />
                查看真实运行
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5"
                href="/store"
              >
                查看生成应用
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e6673f]">
              Execution lifecycle
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              六阶段自主执行模型
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {stages.map(([number, agent, title, text]) => (
              <article className="bg-white p-5" key={agent}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#e6673f]">
                    {number}
                  </span>
                  <Bot className="size-4 text-slate-300" />
                </div>
                <p className="mt-5 font-mono text-[10px] text-slate-400">
                  {agent} Agent
                </p>
                <h3 className="mt-1 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
                  Control plane
                </p>
                <h2 className="mt-2 text-2xl font-bold">架构边界</h2>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  控制器通过已登录的 Codex CLI 执行非交互式 Agent
                  回合。模型运行在受限工作区中；任务选择、白名单验证、重试上限、Git
                  提交和事件证据由外层控制器掌握。
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [
                    Workflow,
                    "Orchestrator",
                    "维护任务图、状态迁移、重试与中断恢复。",
                  ],
                  [Bot, "Codex CLI Adapter", "以 JSONL 事件流执行隔离的编码回合。"],
                  [
                    ShieldCheck,
                    "Policy Engine",
                    "阻断越权操作并触发人工确认。",
                  ],
                  [
                    Database,
                    "Event Store",
                    "保存输入、工具调用、产物和发布证据。",
                  ],
                ].map(([Icon, title, text]) => {
                  const ItemIcon = Icon as typeof Workflow;
                  return (
                    <article
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-5"
                      key={String(title)}
                    >
                      <ItemIcon className="size-4 text-[#e6673f]" />
                      <h3 className="mt-3 text-xs font-bold">{String(title)}</h3>
                      <p className="mt-2 text-[10px] leading-5 text-slate-500">
                        {String(text)}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <RefreshCcw className="size-4 text-blue-600" />
                失败恢复策略
              </h2>
              <div className="mt-5 space-y-3">
                {[
                  "Agent 回合失败：保留 stderr/JSONL，受最大尝试次数约束",
                  "测试失败：把控制器验证输出交回 Codex 定向修复",
                  "需求歧义：暂停任务并向工程师提出最小问题",
                  "发布门禁：浏览器验收和远程写入由工程师确认",
                ].map((item) => (
                  <p
                    className="flex items-start gap-2 text-[11px] leading-5 text-slate-600"
                    key={item}
                  >
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#172033] p-6 text-white shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <UserCheck className="size-4 text-[#ff8054]" />
                Human-in-the-loop
              </h2>
              <p className="mt-4 text-[11px] leading-6 text-slate-300">
                人工确认不是代理失败后的兜底，而是安全模型的一部分。读取和本地可逆操作自动执行；远程写入、权限提升、删除和公开发布必须得到明确授权。
              </p>
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-[10px] text-slate-300">
                <GitPullRequest className="size-4 text-[#ff8054]" />
                示例：推送 GitHub 与更新 Pages 前请求批准
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold">
                  <Boxes className="size-4 text-[#e6673f]" />
                  两个独立仓库，保留系统与生成应用的因果链
                </p>
                <p className="mt-2 text-[10px] text-slate-500">
                  系统仓库包含控制器与运行证据；生成仓库包含独立任务、测试和提交历史。
                </p>
              </div>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#df613b] sm:mt-0"
                href="/store"
              >
                验证业务应用
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
