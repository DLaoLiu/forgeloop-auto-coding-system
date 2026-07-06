#!/usr/bin/env node

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
const taskPath = path.join(workspace, "task.json");
const summaryPath = path.join(workspace, ".agent", "run-summary.json");

if (!(await exists(taskPath))) {
  console.log(`Not bootstrapped: ${workspace}`);
  process.exit(0);
}

const plan = await readJson(taskPath);
console.log(`Project: ${plan.project}`);
console.log(`Workspace: ${workspace}`);
for (const task of plan.tasks) {
  console.log(
    `${task.passes ? "✓" : "○"} ${task.id} · attempts=${task.attempts} · ${
      task.commit || "no commit"
    }`,
  );
}
if (await exists(summaryPath)) {
  const summary = await readJson(summaryPath);
  console.log(`Status: ${summary.status}`);
}
