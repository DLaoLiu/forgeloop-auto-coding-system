"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  FileCode2,
  GitBranch,
  Globe2,
  ListChecks,
  Pause,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UserCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { SiteHeader } from "@/components/site-header";
import {
  initialBriefing,
  workflowTemplate,
  type AgentStatus,
  type WorkflowStep,
} from "@/lib/autonomy";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "waiting" | "done";

const agentIcons = {
  discover: Sparkles,
  architect: Workflow,
  build: Code2,
  test: ListChecks,
  security: ShieldCheck,
  release: Rocket,
};

const agentColors = {
  discover: "#ef7751",
  architect: "#5678d4",
  build: "#19a881",
  test: "#a46cce",
  security: "#e6a938",
  release: "#e85d73",
};

function statusLabel(status: AgentStatus) {
  if (status === "done") return "已完成";
  if (status === "running") return "执行中";
  if (status === "waiting") return "待确认";
  return "等待";
}

export function AutonomyStudio() {
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowTemplate);
  const [runState, setRunState] = useState<RunState>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [runCount, setRunCount] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (runState !== "running" || currentIndex < 0) return;

    const timer = window.setTimeout(() => {
      const current = workflowTemplate[currentIndex];

      if (current.approval) {
        setSteps((items) =>
          items.map((item, index) =>
            index === currentIndex ? { ...item, status: "waiting" } : item,
          ),
        );
        setRunState("waiting");
        return;
      }

      setSteps((items) =>
        items.map((item, index) =>
          index === currentIndex
            ? { ...item, status: "done" }
            : index === currentIndex + 1
              ? { ...item, status: "running" }
              : item,
        ),
      );

      if (currentIndex === workflowTemplate.length - 1) {
        setRunState("done");
      } else {
        setCurrentIndex((index) => index + 1);
      }
    }, currentIndex === 2 ? 1500 : 950);

    return () => window.clearTimeout(timer);
  }, [currentIndex, runState]);

  const completed = steps.filter((step) => step.status === "done").length;
  const progress =
    runState === "done"
      ? 100
      : Math.round((completed / workflowTemplate.length) * 100);
  const activeStep = steps[Math.max(0, currentIndex)];
  const isRunning = runState === "running" || runState === "waiting";

  const activityText = useMemo(() => {
    if (runState === "idle") return initialBriefing;
    if (runState === "waiting")
      return `### Sentinel 请求工程师确认

静态分析与权限清单均已通过。发布动作会写入远程 Git 仓库并更新公开站点，属于外部副作用。

**建议：批准发布。** 当前构建无高危漏洞，所有 Skill 安装动作仍保留二次确认。`;
    if (runState === "done")
      return `### 自主开发闭环已完成

OpenClaw Skill 商店已通过全部质量门禁并生成生产构建。

- 构建：通过
- 安全审查：通过
- 部署产物：已生成
- 工程师介入：1 次（发布授权）`;

    return `### ${activeStep.title}

${activeStep.summary}

当前产物：\`${activeStep.output}\``;
  }, [activeStep, runState]);

  function startRun() {
    setSteps(
      workflowTemplate.map((step, index) => ({
        ...step,
        status: index === 0 ? "running" : "idle",
      })),
    );
    setCurrentIndex(0);
    setRunState("running");
    setRunCount((count) => count + 1);
    setNote("");
  }

  function approve() {
    setSteps((items) =>
      items.map((item, index) =>
        index === currentIndex
          ? { ...item, status: "done" }
          : index === currentIndex + 1
            ? { ...item, status: "running" }
            : item,
      ),
    );
    setRunState("running");
    setCurrentIndex((index) => index + 1);
  }

  function requestFix() {
    setNote("工程师要求：补充安装前权限差异预览。Builder 已生成修复，Probe 回归测试通过。");
    window.setTimeout(() => approve(), 700);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <SiteHeader />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-[#f0f3f7] px-3 py-5 lg:block">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              项目空间
            </span>
            <span className="font-mono text-[10px] text-slate-400">2</span>
          </div>
          <button className="mb-1 flex w-full items-start gap-3 rounded-lg bg-white px-3 py-3 text-left shadow-sm ring-1 ring-slate-200">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-[#172033] text-xs font-bold text-white">
              OC
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold">
                OpenClaw Store
              </span>
              <span className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                active
              </span>
            </span>
          </button>
          <button className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left text-slate-500 hover:bg-white/70">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-slate-300 bg-slate-100 text-xs font-bold">
              API
            </span>
            <span>
              <span className="block text-xs font-semibold">Agent API</span>
              <span className="mt-1 block text-[10px]">已归档</span>
            </span>
          </button>

          <div className="mt-8 px-2">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              运行环境
            </p>
            <div className="space-y-2.5 text-[11px] text-slate-500">
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GitBranch className="size-3.5" /> main
                </span>
                <Check className="size-3 text-emerald-500" />
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe2 className="size-3.5" /> production
                </span>
                <span className="font-mono text-[9px]">READY</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bot className="size-3.5" /> agent policy
                </span>
                <span className="font-mono text-[9px]">v1.2</span>
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white/70 p-3">
            <p className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              最小权限模式
            </p>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              外部写操作必须经过人工批准，密钥不会进入浏览器或日志。
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  <span>Projects</span>
                  <ChevronRight className="size-3" />
                  <span className="text-slate-600">OpenClaw Store</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  AI 自主开发控制台
                </h1>
                <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-500">
                  从自然语言目标到可部署应用的完整闭环。代理自主执行，工程师只处理高风险决策。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  href="/store"
                >
                  <Globe2 className="size-3.5" />
                  查看应用
                </Link>
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-[#172033] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#27334a] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isRunning}
                  onClick={startRun}
                >
                  {runState === "done" ? (
                    <RefreshCw className="size-3.5" />
                  ) : (
                    <Play className="size-3.5 fill-current" />
                  )}
                  {runState === "idle"
                    ? "启动自主开发"
                    : runState === "done"
                      ? "重新运行"
                      : "自主开发中"}
                </button>
              </div>
            </div>
          </section>

          <section className="app-grid grid gap-5 p-4 sm:p-6 lg:p-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-5">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(23,32,51,0.05)]">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-lg",
                        runState === "done"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-orange-50 text-[#ef6a3e]",
                      )}
                    >
                      {runState === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Activity className="size-4" />
                      )}
                    </span>
                    <div>
                      <h2 className="text-sm font-bold">开发工作流</h2>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        run #{String(runCount || 1).padStart(3, "0")} ·
                        deterministic public adapter
                      </p>
                    </div>
                  </div>
                  <div className="flex min-w-[180px] items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#ef6a3e] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-right font-mono text-[10px] font-semibold text-slate-500">
                      {progress}%
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-5">
                  <div className="grid gap-2">
                    {steps.map((step, index) => {
                      const Icon =
                        agentIcons[step.id as keyof typeof agentIcons];
                      const color =
                        agentColors[step.id as keyof typeof agentColors];
                      const selected =
                        index === currentIndex && runState !== "idle";

                      return (
                        <div
                          className={cn(
                            "group grid gap-3 rounded-lg border px-3 py-3 transition sm:grid-cols-[32px_130px_minmax(0,1fr)_105px]",
                            selected
                              ? "border-slate-300 bg-slate-50 shadow-sm"
                              : "border-transparent hover:border-slate-200 hover:bg-slate-50/70",
                          )}
                          key={step.id}
                        >
                          <span
                            className="grid size-8 place-items-center rounded-md text-white"
                            style={{ backgroundColor: color }}
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <div className="min-w-0 self-center">
                            <p className="truncate text-[11px] font-bold text-slate-800">
                              {step.agent}
                            </p>
                            <p className="truncate text-[9px] text-slate-400">
                              {step.role}
                            </p>
                          </div>
                          <div className="min-w-0 self-center">
                            <p className="text-xs font-semibold text-slate-700">
                              {step.title}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-slate-400">
                              {step.summary}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2 self-center sm:justify-end">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold",
                                step.status === "done" &&
                                  "bg-emerald-50 text-emerald-700",
                                step.status === "running" &&
                                  "bg-blue-50 text-blue-700",
                                step.status === "waiting" &&
                                  "bg-amber-50 text-amber-700",
                                step.status === "idle" &&
                                  "bg-slate-100 text-slate-400",
                              )}
                            >
                              {step.status === "done" ? (
                                <Check className="size-2.5" />
                              ) : step.status === "running" ? (
                                <Zap className="size-2.5 pulse-soft" />
                              ) : step.status === "waiting" ? (
                                <Pause className="size-2.5" />
                              ) : (
                                <Circle className="size-2" />
                              )}
                              {statusLabel(step.status)}
                            </span>
                            <span className="hidden font-mono text-[9px] text-slate-400 sm:inline">
                              {step.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xs font-bold">
                      <TerminalSquare className="size-4 text-slate-500" />
                      Agent 输出
                    </h2>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      LIVE
                    </span>
                  </div>
                  <div className="min-h-44 rounded-lg border border-slate-200 bg-[#fbfcfd] p-4 text-xs leading-5">
                    <MessageResponse>{activityText}</MessageResponse>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xs font-bold">
                      <FileCode2 className="size-4 text-slate-500" />
                      交付产物
                    </h2>
                    <span className="text-[9px] font-semibold text-slate-400">
                      AUTO-GENERATED
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      ["产品需求文档", "spec/product-brief.md", "4.2 KB"],
                      ["系统架构", "spec/architecture.md", "6.8 KB"],
                      ["Skill 商店应用", "src/app/store", "28 files"],
                      ["质量报告", "reports/quality.json", "12 checks"],
                    ].map(([name, path, meta], index) => (
                      <div
                        className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
                        key={path}
                      >
                        <span
                          className={cn(
                            "grid size-7 place-items-center rounded-md",
                            index < completed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-400",
                          )}
                        >
                          {index < completed ? (
                            <Check className="size-3.5" />
                          ) : (
                            <FileCode2 className="size-3.5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-semibold">
                            {name}
                          </span>
                          <span className="block truncate font-mono text-[9px] text-slate-400">
                            {path}
                          </span>
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xs font-bold">运行概览</h2>
                  <Clock3 className="size-3.5 text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["自主步骤", `${completed}/${steps.length}`, "step"],
                    ["人工介入", runState === "waiting" || runState === "done" ? "1" : "0", "HITL"],
                    ["质量门禁", completed >= 4 ? "12/12" : "—", "checks"],
                    ["失败恢复", "2", "policy"],
                  ].map(([label, value, meta]) => (
                    <div
                      className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"
                      key={label}
                    >
                      <p className="text-[9px] font-semibold text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1.5 text-lg font-bold tracking-tight">
                        {value}
                      </p>
                      <p className="font-mono text-[8px] uppercase text-slate-400">
                        {meta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl border bg-white p-5 shadow-sm transition",
                  runState === "waiting"
                    ? "border-amber-300 ring-4 ring-amber-50"
                    : "border-slate-200",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xs font-bold">
                    <UserCheck
                      className={cn(
                        "size-4",
                        runState === "waiting"
                          ? "text-amber-600"
                          : "text-slate-400",
                      )}
                    />
                    工程师协作
                  </h2>
                  {runState === "waiting" && (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">
                      需要确认
                    </span>
                  )}
                </div>

                {runState === "waiting" ? (
                  <div>
                    <p className="text-[11px] font-semibold leading-5 text-slate-700">
                      是否允许 Ship Agent 将已通过审查的构建发布到公开环境？
                    </p>
                    <div className="mt-3 rounded-lg bg-amber-50 p-3 text-[10px] leading-4 text-amber-900">
                      变更范围：创建 Git 提交、推送 GitHub、更新 Pages 部署。
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#172033] px-3 py-2.5 text-[10px] font-bold text-white hover:bg-[#27334a]"
                        onClick={approve}
                      >
                        <Check className="size-3" />
                        批准发布
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                        onClick={requestFix}
                      >
                        <X className="size-3" />
                        退回修复
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
                    <Bot className="mx-auto size-5 text-slate-300" />
                    <p className="mt-2 text-[10px] leading-4 text-slate-400">
                      代理会在需要权限提升、外部发布或需求存在歧义时主动暂停。
                    </p>
                  </div>
                )}
                {note && (
                  <p className="mt-3 rounded-lg bg-blue-50 p-3 text-[9px] leading-4 text-blue-800">
                    {note}
                  </p>
                )}
              </div>

              <div className="overflow-hidden rounded-xl bg-[#172033] p-5 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Generated product
                    </p>
                    <h3 className="mt-2 text-sm font-bold">
                      OpenClaw Skill 商店
                    </h3>
                  </div>
                  <span className="grid size-8 place-items-center rounded-lg bg-white/10">
                    <Globe2 className="size-4 text-[#ff8356]" />
                  </span>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-slate-300">
                  可搜索、筛选、审查与安装 Skill 的完整线上商店 Demo。
                </p>
                <Link
                  className="mt-4 inline-flex w-full items-center justify-between rounded-md bg-white px-3 py-2.5 text-[10px] font-bold text-slate-900 transition hover:bg-slate-100"
                  href="/store"
                >
                  打开应用
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
