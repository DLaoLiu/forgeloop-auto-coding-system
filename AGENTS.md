# ForgeLoop Agent Instructions

This repository contains an autonomous coding-loop controller. Keep the controller
separate from the application it generates.

## Required checks

- `npm run lint`
- `npm run build`

## Controller rules

- Use `codex exec --sandbox workspace-write` for coding turns.
- Never use `--dangerously-bypass-approvals-and-sandbox`.
- The runner, not the coding model, owns `task.json` state transitions and Git commits.
- Verification commands must be executable without a shell and must be allowlisted.
- Persist every Codex JSONL event, verification result, retry, approval request, and commit.
- A task only passes after all of its verification commands exit with code 0.
- Stop after the configured maximum attempts instead of looping forever.

## Generated workspace rules

- Generated projects live under `.generated/` and are separate Git repositories.
- Treat generated code as untrusted until verification passes.
- Never copy Codex authentication files or environment secrets into a generated project.
