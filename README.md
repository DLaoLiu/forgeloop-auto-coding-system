# ForgeLoop — AI 自主开发系统 × OpenClaw Skill 商店

本仓库包含两个可运行的交付物：

1. **ForgeLoop AI 自主开发系统 Demo**：从需求、架构、编码、测试、安全审查到发布的完整闭环，支持工程师在高风险节点审批或退回修复。
2. **OpenClaw Skill 线上商店 Demo**：支持搜索、分类筛选、Skill 详情、`SKILL.md` 查看、权限审查和模拟安装。

在线访问：<https://dlaoliu.github.io/forgeloop-openclaw-store/>

## 为什么这样设计

GitHub Pages 是纯静态托管环境，不能安全保存模型密钥。公开 Demo 因此使用确定性 Model Adapter 来复现完整代理状态机；模型层与 Orchestrator、Policy Engine、Event Store 解耦，生产实现可替换为任意 LLM Provider，而无需修改执行和安全逻辑。

这避免了把 API Key 放进浏览器，同时保证评审者无需配置账号即可运行全部交互。

## 自主开发闭环

```text
需求输入
  ↓
Discover → Architect → Build → Verify → Approve → Release
                 ↖──── 失败自动修复 ────┘
                                      ↓
                            GitHub Pages 生产发布
```

- **Discover**：抽取用户故事、约束与验收标准
- **Architect**：生成架构、任务依赖图与风险边界
- **Build**：执行代码变更并生成产物
- **Verify**：运行类型检查、静态分析、构建和关键流程验证
- **Approve**：外部写操作或权限升级时请求工程师确认
- **Release**：创建版本、部署并回写访问地址

## 技术栈

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 / shadcn/ui
- AI Elements `MessageResponse`（Agent Markdown 输出）
- GitHub Actions / GitHub Pages

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>：

- `/` — AI 自主开发控制台
- `/store` — OpenClaw Skill 商店
- `/architecture` — 系统架构与安全说明

## 质量检查

```bash
npm run lint
npm run build
```

`next.config.ts` 使用静态导出，生产文件生成到 `out/`。

## GitHub Pages 部署

仓库包含 `.github/workflows/deploy-pages.yml`。推送 `main` 后会自动：

1. 安装依赖
2. 执行 ESLint
3. 构建静态产物
4. 发布到 GitHub Pages

首次部署前需要在 GitHub 仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

## OpenClaw 兼容性

Skill 数据遵循 OpenClaw 官方约定：

- 每个 Skill 以 `SKILL.md` 为核心
- Frontmatter 包含 `name`、`description`、`version`
- `metadata.openclaw` 声明运行信息
- 安装前展示权限清单和安全状态
- 第三方 Skill 默认视为不可信代码

参考：

- [OpenClaw Skill Format](https://docs.openclaw.ai/clawhub/skill-format)
- [OpenClaw Skills Documentation](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md)

## 安全边界

- 不在前端保存或传输模型 API Key
- 外部发布属于审批操作
- 安装前明确展示权限与来源
- 敏感信息不进入 Agent 提示词或日志
- 失败重试有上限，并保留可审计事件

## 项目结构

```text
src/
  app/
    page.tsx                 # AI 自主开发系统
    store/page.tsx           # Skill 商店
    architecture/page.tsx    # 架构说明
  components/
    autonomy-studio.tsx      # 代理编排与 HITL UI
    skill-store.tsx          # 商店完整交互
    ai-elements/message.tsx  # AI Markdown 渲染
  lib/
    autonomy.ts              # 工作流定义
    skills.ts                # Skill 数据与 manifest
.github/workflows/
  deploy-pages.yml
```
