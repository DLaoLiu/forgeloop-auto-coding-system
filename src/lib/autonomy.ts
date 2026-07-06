export type AgentStatus = "idle" | "running" | "done" | "waiting";

export type WorkflowStep = {
  id: string;
  agent: string;
  role: string;
  title: string;
  summary: string;
  output: string;
  duration: string;
  status: AgentStatus;
  approval?: boolean;
};

export const workflowTemplate: WorkflowStep[] = [
  {
    id: "discover",
    agent: "Scout",
    role: "需求分析 Agent",
    title: "分析业务目标与约束",
    summary: "提取用户故事、验收标准、OpenClaw Skill 格式和发布边界。",
    output: "spec/product-brief.md",
    duration: "18s",
    status: "idle",
  },
  {
    id: "architect",
    agent: "Atlas",
    role: "架构 Agent",
    title: "生成架构与任务图",
    summary: "选择静态优先架构，建立 Store、Workflow、Adapter 三个边界。",
    output: "spec/architecture.md",
    duration: "24s",
    status: "idle",
  },
  {
    id: "build",
    agent: "Builder",
    role: "开发 Agent",
    title: "并行实现应用与编排器",
    summary: "生成响应式商店、安装流程、代理状态机与可观测事件流。",
    output: "38 files changed",
    duration: "1m 42s",
    status: "idle",
  },
  {
    id: "test",
    agent: "Probe",
    role: "测试 Agent",
    title: "执行质量门禁",
    summary: "运行类型检查、静态分析、构建与关键用户流程验证。",
    output: "12 / 12 checks",
    duration: "37s",
    status: "idle",
  },
  {
    id: "security",
    agent: "Sentinel",
    role: "安全审查 Agent",
    title: "审查权限与供应链风险",
    summary: "检测 Skill 权限声明、外部写操作与依赖风险，等待工程师批准发布。",
    output: "approval required",
    duration: "21s",
    status: "idle",
    approval: true,
  },
  {
    id: "release",
    agent: "Ship",
    role: "发布 Agent",
    title: "生成版本并部署",
    summary: "创建发布提交、部署 GitHub Pages 并回写可访问地址。",
    output: "production ready",
    duration: "31s",
    status: "idle",
  },
];

export const initialBriefing = `### 目标已确认

构建一套可观察、可干预的 AI 自主开发闭环，并让它完成 **OpenClaw Skill 线上商店**。

- 自主完成：需求分析 → 架构 → 编码 → 测试 → 安全审查 → 发布
- 人工介入：只在权限升级、外部发布等高风险节点暂停
- 交付标准：公开访问、可重复构建、过程留痕、失败可恢复`;
