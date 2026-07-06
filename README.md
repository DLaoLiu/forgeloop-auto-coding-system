# ForgeLoop Auto-Coding System

ForgeLoop 是一个可执行的 AI 自主开发循环。它先把产品需求交给 Codex CLI
生成架构和任务图，再逐个执行未通过任务；每次 Agent 回合结束后，外层控制器独立运行
白名单验证命令，失败则保留证据并进入下一次修复回合，通过后才创建 Git 提交。

本仓库是自动开发系统；它生成的 OpenClaw Skill Store 位于独立仓库：

- 自动开发系统：<https://github.com/DLaoLiu/forgeloop-auto-coding-system>
- 生成应用：<https://github.com/DLaoLiu/forgeloop-openclaw-store>
- 生成应用 Pages：<https://dlaoliu.github.io/forgeloop-openclaw-store/>

## 真实执行链

```text
产品需求
  ↓
Codex bootstrap → architecture.md + task.json
  ↓
选择第一个 passes=false 的任务
  ↓
Codex CLI 修改文件并自测
  ↓
控制器独立验证 ──失败──→ 记录错误并进入修复回合
  ↓通过
Git 提交 + progress.txt + events.jsonl
  ↓
全部任务完成 → 全局验证 → 可部署产物
```

公开看板只渲染 `src/lib/run-evidence.json` 中同步的真实运行证据，不在浏览器里用
计时器模拟 Agent。

## 运行

前置条件：

- Node.js 20+
- 已安装并登录 Codex CLI；本项目默认使用 Codex.app 内置 CLI，也可设置
  `CODEX_BIN`
- Git

```bash
npm install
npm run agent:bootstrap
npm run agent:run
npm run agent:status
npm run agent:sync
```

- `agent:bootstrap`：在配置的空工作区中生成架构和任务图
- `agent:run`：运行编码、验证、修复和提交循环
- `agent:status`：显示任务、尝试次数和提交
- `agent:sync`：把运行摘要、事件、任务和进度同步到在线看板

原始 Codex JSONL、stderr 和每次验证结果位于生成仓库 `.agent/logs/`。终端默认只输出
任务摘要，完整事件仍会落盘。

## 控制边界

- Codex 使用 `workspace-write` 沙箱，不启用绕过审批模式
- 控制器只执行 `agent.config.json` 中允许的验证命令
- Agent 不能修改任务通过状态或执行 Git 提交
- 每个任务和整个循环都有硬性次数上限
- 需求决策或不安全外部操作可通过 `.agent/approval-request.json` 暂停
- 远程推送、Pages 发布和通知邮件由工程师授权

## 项目结构

```text
agent-system/
  bootstrap.mjs       # 生成架构和任务图
  run-loop.mjs        # 自主编码、验证、修复、提交循环
  status.mjs          # 任务状态
  sync-evidence.mjs   # 同步在线看板证据
requirements/
  openclaw-skill-store.md
automation-logs/latest/
src/
  app/                # 静态证据看板
  lib/run-evidence.json
agent.config.json
```

## 系统站点

```bash
npm run lint
npm run build
```

Next.js 使用静态导出，GitHub Actions 将 `out/` 发布到 GitHub Pages。
