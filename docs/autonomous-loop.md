# ForgeLoop autonomous coding loop

ForgeLoop is a real controller around `codex exec`, not a UI-only workflow.

## Control flow

1. `bootstrap.mjs` initializes an empty Git repository and gives Codex the product
   requirement.
2. Codex writes `architecture.md` and `task.json`.
3. `run-loop.mjs` selects the first task where `passes` is false.
4. Codex implements only that task in a workspace-write sandbox.
5. The controller independently executes allowlisted verification commands.
6. A passing task is marked complete and committed. A failing task records the exact
   output and is retried with that failure as context.
7. The loop stops on completion, an approval request, an attempt limit, or an iteration
   limit.

## Safety properties

- Codex receives write access only to the generated repository.
- The controller never uses the sandbox bypass flag.
- Verification commands are executed without a shell and must be allowlisted.
- Tasks and iterations have hard limits.
- Authentication files and secrets are outside the generated workspace.
- Human decisions use `.agent/approval-request.json`; the runner pauses instead of
  guessing.

## Evidence

Each run produces:

- `.agent/events.jsonl`
- `.agent/logs/<iteration>-<task>-<attempt>/codex-events.jsonl`
- verification stdout/stderr logs
- `progress.txt`
- `task.json` state
- one or more Git commits per completed task
- `.agent/run-summary.json`
