# AGENT.md — Rules for AI Agents Working on This Project

This file is the first thing any AI agent (Claude, or otherwise) should read when starting work on this repo. It exists to keep token usage low, prevent unnecessary file scanning, and make sure changes are precise instead of speculative.

## 1. Before doing anything: read `docs/working.md`

`docs/working.md` is the running timeline of work on this project — what task was last worked on, where it stopped, and what's next. Always check it first to know current project state before touching code.

## 2. Token discipline — do not roam the codebase

- **Never** read an entire component, folder, or the whole `src/` tree "just to be safe." Only read the specific file(s) and line range relevant to the task.
- If the user names a file or component, start there. Only branch out to other files if that file actually imports/references something you need to verify.
- Prefer targeted search (grep/glob for a specific symbol, string, or component name) over open-ended exploration.
- Do not pre-emptively read config files, styles, or unrelated components "for context" unless the task clearly requires it.
- If a task could be done by editing one file, don't open five.

## 3. Clarify before acting — no silent assumptions

- If a task is ambiguous (e.g. "fix the dashboard section"), **ask for specifics** before editing anything: which component, what's wrong/expected, which file if known.
- Do not guess which section/component "dashboard" refers to if there are multiple candidates — ask, or do one minimal targeted search to confirm the exact file, then confirm with the user if still unsure.
- Do not expand scope beyond what was asked. If the user asks to fix one bug, don't refactor surrounding code, rename things, or "clean up" unless explicitly asked.
- State which exact file/lines you're about to change before making large edits, if there's any ambiguity about scope.

## 4. Locate precisely, then act

- Use Grep/Glob to find the exact function, component, or line before editing — don't open a whole file to "scan" for it.
- Once the precise location is found, make the smallest correct change that satisfies the request.

## 5. Delivering results

- After finishing a task, update `docs/working.md` with: what was done, current state, and any next steps or open issues — so a future agent/session (even after this one's quota runs out) can pick up exactly where it left off.
- Keep responses and summaries concise — state what changed and where (file:line), not a narration of the process.

## 6. Keep `docs/working.md` lean

- Before adding a new entry, prune old entries that are no longer useful context — e.g. tasks that are fully complete, superseded, or irrelevant to current/upcoming work. Don't let the file grow indefinitely.
- Keep only what a new agent actually needs: the most recent entry (current state, what's next), plus any older entries that describe still-relevant decisions, in-progress work, or unresolved issues.
- When pruning, it's fine to compress a finished entry into a single short line in a "Completed (archive)" section instead of deleting it outright, if it might still be useful to recall later — but don't keep full verbose entries around once they're done and acted on.
- The goal is to keep this file small so reading it never costs significant context/tokens.

## 7. Commit messages

- Use **Conventional Commits** format for the title: `<type>(<scope>): <short summary>`
  - Common types: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`, `perf`
  - `scope` is optional but preferred when the change is localized (e.g. `dashboard`, `auth`, `docs`)
- Follow the title with bullet points of what changed. Bullets must be **specific and complete** — name the actual file(s), component(s), or behavior changed. Do not compress bullets into vague one-liners that drop key detail (e.g. not "update docs", but "add AGENT.md with token discipline, scope, and commit rules").
- No filler, no narration of process, no explaining why it was asked — but never sacrifice specificity for brevity.
- Format:
  ```
  <type>(<scope>): <short summary>

  - <specific detail of what changed, bullet 1>
  - <specific detail of what changed, bullet 2>
  ```
- Example:
  ```
  docs(agent): add agent rules and working log

  - Add AGENT.md at repo root with rules on token discipline, precise code
    location before editing, scope limits, pruning docs/working.md, and
    Conventional Commits format
  - Seed docs/working.md (was empty) as a task timeline log with an initial
    entry documenting this setup
  ```

## 8. When in doubt

Ask the user. A clarifying question costs far less than an incorrect or overly broad edit.
