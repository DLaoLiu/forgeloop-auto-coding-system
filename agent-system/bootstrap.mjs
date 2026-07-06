#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  appendJsonl,
  controllerRoot,
  ensureGitRepository,
  exists,
  gitCommit,
  loadConfig,
  parseArgs,
  readJson,
  runCodex,
  timestamp,
  validateTaskPlan,
} from "./lib/common.mjs";

const args = parseArgs(process.argv.slice(2));
const configPath = path.resolve(
  controllerRoot,
  args.config || "agent.config.json",
);
const config = await loadConfig(configPath);
const workspace = args.workspace
  ? path.resolve(args.workspace)
  : config.workspace;
const requirementPath = args.requirement
  ? path.resolve(args.requirement)
  : config.requirement;

await ensureGitRepository(workspace);
await mkdir(path.join(workspace, ".agent", "logs"), { recursive: true });

if (
  !args.force &&
  ((await exists(path.join(workspace, "task.json"))) ||
    (await exists(path.join(workspace, "architecture.md"))))
) {
  throw new Error(
    "Workspace is already bootstrapped. Pass --force only after reviewing existing state.",
  );
}

const requirement = await readFile(requirementPath, "utf8");
await writeFile(path.join(workspace, "REQUIREMENT.md"), requirement, "utf8");
await writeFile(
  path.join(workspace, "progress.txt"),
  `# ForgeLoop progress\n\nBootstrapped at ${timestamp()}\n`,
  "utf8",
);

const eventsFile = path.join(workspace, ".agent", "events.jsonl");
await appendJsonl(eventsFile, {
  type: "bootstrap.started",
  requirement: path.relative(controllerRoot, requirementPath),
});

const prompt = `You are the planning stage of a real autonomous coding loop.

Read REQUIREMENT.md in this empty Git repository. Create exactly two planning files:

1. architecture.md — a concrete implementation architecture, file layout, data model,
   accessibility approach, verification strategy, and GitHub Pages deployment plan.
2. task.json — an ordered implementation plan following this exact shape:

{
  "project": "string",
  "generatedAt": "ISO timestamp",
  "tasks": [
    {
      "id": "lowercase-kebab-case",
      "title": "short title",
      "description": "bounded implementation task",
      "acceptanceCriteria": ["observable criterion"],
      "verification": [
        { "command": "node", "args": ["tests/validate.mjs", "--task", "task-id"] }
      ],
      "passes": false,
      "attempts": 0,
      "lastFailure": null,
      "completedAt": null,
      "commit": null
    }
  ]
}

Rules:
- Produce 5-8 tasks, ordered so each can be completed and verified independently.
- The first task must create the application scaffold and deterministic validation script.
- Use only the commands "node", "npm", or "npx" in verification entries.
- Prefer "node tests/validate.mjs --task <id>" because the product has no dependencies.
- The last task must cover final accessibility, documentation, provenance, and Pages deployment.
- Do not implement the application now.
- Do not mark any task as passed.
- Do not commit.
- Finish only after both files are valid and consistent with REQUIREMENT.md.`;

const logPrefix = path.join(workspace, ".agent", "logs", "bootstrap");
const result = await runCodex({
  workspace,
  prompt,
  model: config.model,
  stdoutFile: `${logPrefix}.jsonl`,
  stderrFile: `${logPrefix}.stderr.log`,
});

if (result.code !== 0) {
  await appendJsonl(eventsFile, {
    type: "bootstrap.failed",
    exitCode: result.code,
  });
  throw new Error(`Codex bootstrap failed with exit code ${result.code}`);
}

const planPath = path.join(workspace, "task.json");
if (!(await exists(planPath)) || !(await exists(path.join(workspace, "architecture.md")))) {
  throw new Error("Codex did not create architecture.md and task.json");
}

const plan = await readJson(planPath);
const validationErrors = validateTaskPlan(plan);
if (validationErrors.length) {
  throw new Error(`Invalid task plan:\n- ${validationErrors.join("\n- ")}`);
}

const commit = await gitCommit(workspace, "plan: generate architecture and task graph");
await appendJsonl(eventsFile, {
  type: "bootstrap.completed",
  taskCount: plan.tasks.length,
  commit,
});

console.log(
  `\nForgeLoop bootstrap complete\nWorkspace: ${workspace}\nTasks: ${plan.tasks.length}\nCommit: ${commit}`,
);
