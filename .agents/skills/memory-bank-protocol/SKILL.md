---
name: memory-bank-protocol
description: How to read, write, and maintain the vibe modules' shared Memory Bank. The agent's persistent cross-session memory for Foundry VTT module development.
---

# Memory Bank Protocol

**Last Updated:** 2026-06-06

This skill governs how you interact with the vibe modules' shared **Memory
Bank** — your persistent, cross-session memory for the `vibe-*` Foundry VTT
module suite. You have no other long-term memory for this codebase.

## Location

`vibe-common/memory-bank/` — centralized in `vibe-common` because it is the
shared dependency of every vibe module. When working inside `vibe-actor`,
`vibe-combat`, or another sibling module, the bank is at
`../vibe-common/memory-bank/` relative to your module root.

```
vibe-common/memory-bank/
├── AGENTS.md       # Root index — start here
├── logs/           # YYYY-MM-DD.md daily session logs (history + handover)
├── knowledge/      # Categorized, tagged gotchas & patterns
├── projects/       # One folder per multi-session initiative
└── scratch/        # Ephemeral daily work (gitignored)
```

## Boot Protocol (session start)

When starting a task or session involving any vibe module, "boot up" your
context by reading, in order:

1. **`memory-bank/AGENTS.md`** — how the bank is organized.
2. **The most recent `logs/` entry** — the handover from the last session:
   what was done and what to pick up next.
3. **Relevant `projects/*/AGENTS.md`** — the state of any in-flight
   initiative you're continuing.
4. **`knowledge/` by tag** — search for entries matching the area you're
   about to touch (e.g. `application-v2`, `gemini`, `scene-controls`) so you
   don't re-hit a known gotcha.

## Session Closing Protocol ("finish session" / "save session")

When the user says "finish session", "save session", or similar:

1. **Write/append today's log.** Create or update
   `logs/YYYY-MM-DD.md` with a `##` section per topic, bullets linking
   changed files and commits.
2. **Update touched projects.** For each `projects/*/AGENTS.md` you worked
   in, refresh its **Status** and **Next Session** sections.
3. **Capture new knowledge.** Any new gotcha, quirk, or pattern discovered
   this session becomes a new entry under `knowledge/<category>/`.
4. **Bump `modified:` dates.** Update the `modified:` field on every file you
   changed. **Verify the real system date first — never assume it.**

## Operational Rules

### Date verification (critical)

Before modifying ANY memory-bank file, check the system date (run `date` or
the system time tool). Always update `modified:` fields. **Never assume
dates.**

### Check before create

Search existing logs, knowledge, and projects before creating new files.
Prefer updating an existing entry over making a duplicate.

### Frontmatter on everything

Every markdown file gets `created` / `modified` / `tags` / `summary` /
`module`, plus optional `references`. The `module:` field tags which vibe
module a note applies to (`vibe-common`, `vibe-actor`, `vibe-combat`, or
`shared`).

### Scratch is ephemeral, projects are persistent

Use `scratch/YYYY-MM-DD/` for throwaway work. Promote to `projects/` once
files prove reusable across days, and note the promotion in the log.

### Self-improvement (the gardener)

You maintain this protocol and the knowledge base. When you discover a new
pattern or rule, add it to `knowledge/` (or the relevant skill) rather than
leaving it loose. If a knowledge category grows unwieldy, propose splitting
it. Keep `modified:` and `Last Updated:` current.

## English only

Code, comments, UI content, and all memory-bank files are 100% English.
