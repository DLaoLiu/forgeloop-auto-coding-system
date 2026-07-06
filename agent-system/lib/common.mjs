import { spawn } from "node:child_process";
import { access, appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const controllerRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../..",
);

export function timestamp() {
  return new Date().toISOString();
}

export function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

export async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, filePath);
}

export async function appendJsonl(filePath, event) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(
    filePath,
    `${JSON.stringify({ at: timestamp(), ...event })}\n`,
    "utf8",
  );
}

export async function loadConfig(configPath) {
  const config = await readJson(configPath);
  const workspace = path.resolve(controllerRoot, config.workspace);
  const requirement = path.resolve(controllerRoot, config.requirement);
  return { ...config, workspace, requirement, configPath };
}

export function validateTaskPlan(plan) {
  const errors = [];
  if (!plan || typeof plan !== "object") errors.push("task plan must be an object");
  if (!plan.project || typeof plan.project !== "string") {
    errors.push("project must be a non-empty string");
  }
  if (!Array.isArray(plan.tasks) || plan.tasks.length === 0) {
    errors.push("tasks must be a non-empty array");
  }

  const ids = new Set();
  for (const [index, task] of (plan.tasks ?? []).entries()) {
    if (!task.id || typeof task.id !== "string") {
      errors.push(`tasks[${index}].id must be a string`);
    } else if (ids.has(task.id)) {
      errors.push(`duplicate task id: ${task.id}`);
    } else {
      ids.add(task.id);
    }
    if (!task.title || typeof task.title !== "string") {
      errors.push(`tasks[${index}].title must be a string`);
    }
    if (!task.description || typeof task.description !== "string") {
      errors.push(`tasks[${index}].description must be a string`);
    }
    if (!Array.isArray(task.acceptanceCriteria) || task.acceptanceCriteria.length === 0) {
      errors.push(`tasks[${index}].acceptanceCriteria must be non-empty`);
    }
    if (!Array.isArray(task.verification) || task.verification.length === 0) {
      errors.push(`tasks[${index}].verification must be non-empty`);
    }
    for (const verification of task.verification ?? []) {
      if (!verification.command || !Array.isArray(verification.args)) {
        errors.push(`task ${task.id ?? index} has invalid verification command`);
      }
    }
    if (typeof task.passes !== "boolean") {
      errors.push(`tasks[${index}].passes must be boolean`);
    }
  }
  return errors;
}

export async function runProcess({
  command,
  args = [],
  cwd,
  env,
  stdoutFile,
  stderrFile,
  echo = true,
}) {
  if (stdoutFile) await mkdir(path.dirname(stdoutFile), { recursive: true });
  if (stderrFile) await mkdir(path.dirname(stderrFile), { recursive: true });

  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  const collect = async (stream, target, isError) => {
    for await (const chunk of stream) {
      const text = chunk.toString();
      if (isError) stderr += text;
      else stdout += text;
      if (target) await appendFile(target, text, "utf8");
      if (echo) (isError ? process.stderr : process.stdout).write(text);
    }
  };

  const [code] = await Promise.all([
    new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", resolve);
    }),
    collect(child.stdout, stdoutFile, false),
    collect(child.stderr, stderrFile, true),
  ]);

  return { code: code ?? 1, stdout, stderr };
}

export async function ensureGitRepository(workspace) {
  await mkdir(workspace, { recursive: true });
  if (!(await exists(path.join(workspace, ".git")))) {
    const initialized = await runProcess({
      command: "git",
      args: ["init", "-b", "main"],
      cwd: workspace,
    });
    if (initialized.code !== 0) throw new Error("failed to initialize Git repository");
    await runProcess({
      command: "git",
      args: ["config", "user.name", "ForgeLoop Agent"],
      cwd: workspace,
    });
    await runProcess({
      command: "git",
      args: ["config", "user.email", "forgeloop-agent@users.noreply.github.com"],
      cwd: workspace,
    });
  }
}

export async function gitCommit(workspace, message) {
  await runProcess({ command: "git", args: ["add", "-A"], cwd: workspace });
  const status = await runProcess({
    command: "git",
    args: ["status", "--porcelain"],
    cwd: workspace,
    echo: false,
  });
  if (!status.stdout.trim()) return null;

  const commit = await runProcess({
    command: "git",
    args: ["commit", "-m", message],
    cwd: workspace,
  });
  if (commit.code !== 0) throw new Error(`git commit failed: ${message}`);

  const sha = await runProcess({
    command: "git",
    args: ["rev-parse", "--short", "HEAD"],
    cwd: workspace,
    echo: false,
  });
  return sha.stdout.trim();
}

export function findCodexBinary() {
  return (
    process.env.CODEX_BIN ||
    "/Applications/Codex.app/Contents/Resources/codex"
  );
}

export async function runCodex({
  workspace,
  prompt,
  model,
  stdoutFile,
  stderrFile,
}) {
  const args = [
    "exec",
    "--sandbox",
    "workspace-write",
    "--json",
    "--ephemeral",
    "--cd",
    workspace,
  ];
  if (model) args.push("--model", model);
  args.push(prompt);
  return runProcess({
    command: findCodexBinary(),
    args,
    cwd: workspace,
    stdoutFile,
    stderrFile,
    echo: false,
  });
}

export function formatVerificationFailure(results) {
  return results
    .filter((result) => result.code !== 0)
    .map(
      (result) =>
        `$ ${result.command} ${result.args.join(" ")}\n${(
          result.stderr || result.stdout
        ).slice(-4000)}`,
    )
    .join("\n\n");
}

export async function runVerifications({
  commands,
  workspace,
  allowedCommands,
  logDirectory,
}) {
  const results = [];
  for (const [index, verification] of commands.entries()) {
    if (!allowedCommands.includes(verification.command)) {
      results.push({
        ...verification,
        code: 126,
        stdout: "",
        stderr: `Command is not allowlisted: ${verification.command}`,
      });
      continue;
    }
    const result = await runProcess({
      command: verification.command,
      args: verification.args,
      cwd: workspace,
      stdoutFile: path.join(logDirectory, `verify-${index + 1}.stdout.log`),
      stderrFile: path.join(logDirectory, `verify-${index + 1}.stderr.log`),
    });
    results.push({ ...verification, ...result });
    if (result.code !== 0) break;
  }
  return results;
}
