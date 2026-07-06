#!/usr/bin/env node

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  appendJsonl,
  controllerRoot,
  exists,
  formatVerificationFailure,
  gitCommit,
  loadConfig,
  parseArgs,
  readJson,
  runCodex,
  runVerifications,
  timestamp,
  validateTaskPlan,
  writeJsonAtomic,
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
const maxIterations = Number(args.iterations || config.maxIterations || 10);
const eventsFile = path.join(workspace, ".agent", "events.jsonl");
const summaryFile = path.join(workspace, ".agent", "run-summary.json");
const planPath = path.join(workspace, "task.json");
const progressPath = path.join(workspace, "progress.txt");
const approvalPath = path.join(workspace, ".agent", "approval-request.json");

if (!(await exists(planPath))) {
  throw new Error("task.json is missing. Run npm run agent:bootstrap first.");
}

await mkdir(path.join(workspace, ".agent", "logs"), { recursive: true });
await appendJsonl(eventsFile, {
  type: "loop.started",
  maxIterations,
});

let iteration = 0;
let terminalStatus = "iteration-limit";

while (iteration < maxIterations) {
  const plan = await readJson(planPath);
  const validationErrors = validateTaskPlan(plan);
  if (validationErrors.length) {
    throw new Error(`Invalid task plan:\n- ${validationErrors.join("\n- ")}`);
  }

  const task = plan.tasks.find((candidate) => !candidate.passes);
  if (!task) {
    terminalStatus = "completed";
    break;
  }

  const maxAttempts = Number(task.maxAttempts || config.maxTaskAttempts || 3);
  if (task.attempts >= maxAttempts) {
    terminalStatus = "task-attempt-limit";
    await appendJsonl(eventsFile, {
      type: "loop.stopped",
      reason: terminalStatus,
      taskId: task.id,
      attempts: task.attempts,
    });
    break;
  }

  iteration += 1;
  task.attempts += 1;
  await writeJsonAtomic(planPath, plan);

  const attemptDirectory = path.join(
    workspace,
    ".agent",
    "logs",
    `${String(iteration).padStart(2, "0")}-${task.id}-attempt-${task.attempts}`,
  );
  await mkdir(attemptDirectory, { recursive: true });
  await appendJsonl(eventsFile, {
    type: "task.started",
    iteration,
    taskId: task.id,
    title: task.title,
    attempt: task.attempts,
  });

  const recentProgress = (await readFile(progressPath, "utf8")).slice(-6000);
  const previousFailure = task.lastFailure || "No previous failure.";
  const prompt = `You are the implementation turn in an autonomous coding loop.

Read REQUIREMENT.md, architecture.md, task.json, and progress.txt.

Active task:
${JSON.stringify(
  {
    id: task.id,
    title: task.title,
    description: task.description,
    acceptanceCriteria: task.acceptanceCriteria,
    verification: task.verification,
  },
  null,
  2,
)}

Previous verification failure:
${previousFailure}

Recent progress:
${recentProgress}

Execution rules:
- Implement only the active task, but fix directly related defects required for verification.
- Inspect existing files before editing.
- Run the task verification commands yourself before finishing.
- Do not edit task.json fields passes, attempts, completedAt, commit, or lastFailure.
- Do not run git commit or git push; the controller owns commits.
- Do not access files outside this repository.
- Never read or print authentication files, environment secrets, or user configuration.
- If a product decision or unsafe external action genuinely requires a human, write
  .agent/approval-request.json with {"taskId","question","reason","options"} and stop.
- Finish with a concise summary of files changed and verification performed.`;

  const codexResult = await runCodex({
    workspace,
    prompt,
    model: config.model,
    stdoutFile: path.join(attemptDirectory, "codex-events.jsonl"),
    stderrFile: path.join(attemptDirectory, "codex.stderr.log"),
  });

  if (await exists(approvalPath)) {
    terminalStatus = "waiting-for-approval";
    const approval = await readJson(approvalPath);
    await appendJsonl(eventsFile, {
      type: "approval.requested",
      taskId: task.id,
      approval,
    });
    break;
  }

  const verificationResults = await runVerifications({
    commands: task.verification,
    workspace,
    allowedCommands: config.allowedCommands,
    logDirectory: attemptDirectory,
  });
  const passed =
    codexResult.code === 0 &&
    verificationResults.length === task.verification.length &&
    verificationResults.every((result) => result.code === 0);

  const latestPlan = await readJson(planPath);
  const latestTask = latestPlan.tasks.find((candidate) => candidate.id === task.id);

  if (passed) {
    latestTask.passes = true;
    latestTask.lastFailure = null;
    latestTask.completedAt = timestamp();
    await appendFile(
      progressPath,
      `\n## ${latestTask.id} — completed\n- Attempt: ${latestTask.attempts}\n- Completed: ${latestTask.completedAt}\n- Verification: ${latestTask.verification
        .map((item) => `\`${item.command} ${item.args.join(" ")}\``)
        .join(", ")}\n`,
      "utf8",
    );
    await writeJsonAtomic(planPath, latestPlan);
    const commit = await gitCommit(
      workspace,
      `feat(${latestTask.id}): ${latestTask.title}`,
    );
    latestTask.commit = commit;
    await writeJsonAtomic(planPath, latestPlan);
    await gitCommit(workspace, `chore(${latestTask.id}): record task evidence`);
    await appendJsonl(eventsFile, {
      type: "task.completed",
      iteration,
      taskId: latestTask.id,
      attempt: latestTask.attempts,
      commit,
      verification: verificationResults.map((item) => ({
        command: item.command,
        args: item.args,
        exitCode: item.code,
      })),
    });
  } else {
    const failure = [
      codexResult.code !== 0
        ? `Codex exited with code ${codexResult.code}\n${codexResult.stderr.slice(-3000)}`
        : "",
      formatVerificationFailure(verificationResults),
    ]
      .filter(Boolean)
      .join("\n\n");
    latestTask.lastFailure = failure.slice(-6000);
    await appendFile(
      progressPath,
      `\n## ${latestTask.id} — attempt ${latestTask.attempts} failed\n\`\`\`\n${latestTask.lastFailure}\n\`\`\`\n`,
      "utf8",
    );
    await writeJsonAtomic(planPath, latestPlan);
    await gitCommit(
      workspace,
      `fix(${latestTask.id}): record failed attempt ${latestTask.attempts}`,
    );
    await appendJsonl(eventsFile, {
      type: "task.failed",
      iteration,
      taskId: latestTask.id,
      attempt: latestTask.attempts,
      codexExitCode: codexResult.code,
      failure: latestTask.lastFailure,
    });
  }
}

if (
  terminalStatus === "completed" &&
  Array.isArray(config.globalVerification) &&
  config.globalVerification.length
) {
  const finalVerificationDirectory = path.join(
    workspace,
    ".agent",
    "logs",
    "final-verification",
  );
  const finalVerification = await runVerifications({
    commands: config.globalVerification,
    workspace,
    allowedCommands: config.allowedCommands,
    logDirectory: finalVerificationDirectory,
  });
  const finalPassed =
    finalVerification.length === config.globalVerification.length &&
    finalVerification.every((result) => result.code === 0);
  await appendJsonl(eventsFile, {
    type: finalPassed
      ? "global-verification.completed"
      : "global-verification.failed",
    verification: finalVerification.map((item) => ({
      command: item.command,
      args: item.args,
      exitCode: item.code,
    })),
  });
  if (!finalPassed) terminalStatus = "global-verification-failed";
}

const finalPlan = await readJson(planPath);
const completedTasks = finalPlan.tasks.filter((task) => task.passes).length;
const summary = {
  project: finalPlan.project,
  status: terminalStatus,
  startedBy: "ForgeLoop Codex CLI controller",
  generatedAt: timestamp(),
  workspace,
  iterations: iteration,
  completedTasks,
  totalTasks: finalPlan.tasks.length,
  tasks: finalPlan.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    passes: task.passes,
    attempts: task.attempts,
    commit: task.commit,
    completedAt: task.completedAt,
    lastFailure: task.lastFailure,
  })),
};
await writeJsonAtomic(summaryFile, summary);
await appendJsonl(eventsFile, {
  type: "loop.finished",
  status: terminalStatus,
  completedTasks,
  totalTasks: finalPlan.tasks.length,
});

console.log(
  `\nForgeLoop stopped: ${terminalStatus}\nCompleted: ${completedTasks}/${finalPlan.tasks.length}\nSummary: ${summaryFile}`,
);

if (terminalStatus !== "completed") process.exitCode = 2;
