#!/usr/bin/env node

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  controllerRoot,
  exists,
  loadConfig,
  parseArgs,
  readJson,
} from "./lib/common.mjs";

const args = parseArgs(process.argv.slice(2));
const config = await loadConfig(
  path.resolve(controllerRoot, args.config || "agent.config.json"),
);
const workspace = args.workspace
  ? path.resolve(args.workspace)
  : config.workspace;
const sourceSummary = path.join(workspace, ".agent", "run-summary.json");
const sourceEvents = path.join(workspace, ".agent", "events.jsonl");
const targetDirectory = path.join(controllerRoot, "automation-logs", "latest");

if (!(await exists(sourceEvents))) {
  throw new Error("Run evidence is missing. Execute the loop first.");
}

await mkdir(targetDirectory, { recursive: true });
const plan = await readJson(path.join(workspace, "task.json"));
const events = (await readFile(sourceEvents, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const completedTasks = plan.tasks.filter((task) => task.passes).length;
const summary = (await exists(sourceSummary))
  ? await readJson(sourceSummary)
  : {
      project: plan.project,
      status: completedTasks === plan.tasks.length ? "completed" : "interrupted",
      startedBy: "ForgeLoop Codex CLI controller",
      generatedAt: new Date().toISOString(),
      iterations: events.filter((event) => event.type === "task.started").length,
      completedTasks,
      totalTasks: plan.tasks.length,
      tasks: plan.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        passes: task.passes,
        attempts: task.attempts,
        commit: task.commit,
        completedAt: task.completedAt,
        lastFailure: task.lastFailure,
      })),
    };
summary.workspace = ".generated/openclaw-skill-store";
await writeFile(
  path.join(targetDirectory, "run-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await copyFile(sourceEvents, path.join(targetDirectory, "events.jsonl"));
await copyFile(
  path.join(workspace, "task.json"),
  path.join(targetDirectory, "task.json"),
);
await copyFile(
  path.join(workspace, "progress.txt"),
  path.join(targetDirectory, "progress.txt"),
);

await writeFile(
  path.join(controllerRoot, "src", "lib", "run-evidence.json"),
  `${JSON.stringify({ summary, events }, null, 2)}\n`,
  "utf8",
);

console.log(`Synced run evidence to ${targetDirectory}`);
