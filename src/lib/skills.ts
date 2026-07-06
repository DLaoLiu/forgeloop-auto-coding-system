export type SkillRisk = "低风险" | "中风险" | "已验证";

export type Skill = {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  description: string;
  longDescription: string;
  version: string;
  downloads: string;
  rating: number;
  reviews: number;
  risk: SkillRisk;
  icon: string;
  accent: string;
  featured?: boolean;
  permissions: string[];
  updatedAt: string;
};

export const categories = [
  "全部",
  "开发工具",
  "效率工具",
  "数据处理",
  "内容创作",
  "运维",
];

export const skills: Skill[] = [
  {
    id: "github-pilot",
    name: "GitHub Pilot",
    slug: "@clawlab/github-pilot",
    author: "ClawLab",
    category: "开发工具",
    description: "从 Issue 到 Pull Request 的完整开发协作，让代理安全地完成代码变更。",
    longDescription:
      "读取仓库上下文，拆解 Issue、创建分支、提交变更并生成 Pull Request 摘要。高风险写操作会进入人工确认队列。",
    version: "2.4.1",
    downloads: "18.6k",
    rating: 4.9,
    reviews: 328,
    risk: "已验证",
    icon: "GH",
    accent: "#ff7849",
    featured: true,
    permissions: ["读取 GitHub 仓库", "创建分支与提交", "创建 Pull Request"],
    updatedAt: "2 天前",
  },
  {
    id: "browser-flow",
    name: "Browser Flow",
    slug: "@openclaw/browser-flow",
    author: "OpenClaw",
    category: "效率工具",
    description: "用自然语言编排浏览器任务，支持表单、截图和端到端流程验证。",
    longDescription:
      "提供带审计日志的浏览器自动化能力。默认限制跨域数据传输，提交表单前可配置人工审批。",
    version: "1.8.0",
    downloads: "42.1k",
    rating: 4.8,
    reviews: 614,
    risk: "中风险",
    icon: "BF",
    accent: "#4ca6ff",
    featured: true,
    permissions: ["访问网页内容", "执行点击与输入", "保存页面截图"],
    updatedAt: "5 天前",
  },
  {
    id: "csv-insight",
    name: "CSV Insight",
    slug: "@dataworks/csv-insight",
    author: "DataWorks",
    category: "数据处理",
    description: "清洗、分析并可视化本地 CSV，无需上传原始文件。",
    longDescription:
      "在本地沙箱执行列类型推断、质量检查、聚合和可视化建议，适合销售与运营数据分析。",
    version: "3.1.2",
    downloads: "31.7k",
    rating: 4.9,
    reviews: 287,
    risk: "低风险",
    icon: "CI",
    accent: "#27c58b",
    featured: true,
    permissions: ["读取选定的本地文件", "创建分析结果文件"],
    updatedAt: "1 周前",
  },
  {
    id: "docker-ops",
    name: "Docker Ops",
    slug: "@infra/docker-ops",
    author: "InfraKit",
    category: "运维",
    description: "检查容器健康、分析日志并生成安全的恢复建议。",
    longDescription:
      "读取 Docker 状态和日志，先生成修复计划；重启、删除等变更始终要求工程师确认。",
    version: "2.0.3",
    downloads: "12.4k",
    rating: 4.7,
    reviews: 156,
    risk: "中风险",
    icon: "DO",
    accent: "#7b8cff",
    permissions: ["读取 Docker 状态", "读取容器日志", "经批准管理容器"],
    updatedAt: "3 天前",
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    slug: "@dayflow/meeting-notes",
    author: "Dayflow",
    category: "效率工具",
    description: "把会议录音与笔记整理成决策、负责人和待办事项。",
    longDescription:
      "从会议文本中抽取结构化行动项，自动生成适合邮件或项目管理工具的跟进摘要。",
    version: "1.5.4",
    downloads: "26.9k",
    rating: 4.8,
    reviews: 401,
    risk: "低风险",
    icon: "MN",
    accent: "#f2b84b",
    permissions: ["读取用户选择的文本", "生成本地 Markdown 文件"],
    updatedAt: "6 天前",
  },
  {
    id: "copy-studio",
    name: "Copy Studio",
    slug: "@makers/copy-studio",
    author: "Makers",
    category: "内容创作",
    description: "将产品资料转换为多渠道营销文案，并保持品牌语气一致。",
    longDescription:
      "基于品牌术语表生成落地页、邮件与社交媒体文案，提供事实核验清单与版本比较。",
    version: "1.9.1",
    downloads: "9.8k",
    rating: 4.6,
    reviews: 98,
    risk: "低风险",
    icon: "CS",
    accent: "#e96f9d",
    permissions: ["读取品牌资料", "创建文案文件"],
    updatedAt: "2 周前",
  },
  {
    id: "api-tester",
    name: "API Tester",
    slug: "@clawlab/api-tester",
    author: "ClawLab",
    category: "开发工具",
    description: "从 OpenAPI 文档生成测试矩阵、执行检查并输出可追踪报告。",
    longDescription:
      "解析 OpenAPI schema，生成边界与失败场景。在沙箱内执行请求并对敏感 Header 自动脱敏。",
    version: "2.2.0",
    downloads: "15.3k",
    rating: 4.7,
    reviews: 184,
    risk: "已验证",
    icon: "AT",
    accent: "#11b8c7",
    permissions: ["访问指定 API", "读取 OpenAPI 文档", "创建测试报告"],
    updatedAt: "4 天前",
  },
  {
    id: "release-notes",
    name: "Release Notes",
    slug: "@shipit/release-notes",
    author: "ShipIt",
    category: "开发工具",
    description: "根据提交与 PR 自动生成面向用户和工程团队的发布说明。",
    longDescription:
      "聚合指定版本范围内的提交，按功能、修复与破坏性变更分类，并保留来源链接。",
    version: "1.3.7",
    downloads: "8.6k",
    rating: 4.8,
    reviews: 76,
    risk: "低风险",
    icon: "RN",
    accent: "#a17be8",
    permissions: ["读取 Git 历史", "读取 Pull Request", "创建 Markdown 文件"],
    updatedAt: "1 周前",
  },
];

export function skillManifest(skill: Skill) {
  return `---
name: ${skill.id}
description: ${skill.description}
version: ${skill.version}
metadata:
  openclaw:
    emoji: "🦞"
    homepage: https://github.com/${skill.author.toLowerCase()}/${skill.id}
---

# ${skill.name}

${skill.longDescription}

## Safety

- 所有外部写操作必须经过用户确认
- 敏感信息不得写入提示词或日志
- 默认在最小权限沙箱中运行`;
}
