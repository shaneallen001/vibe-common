---
created: 2026-06-06
modified: 2026-06-06
tags: [meta, memory-bank, agent-instructions, foundry]
summary: Root index for the vibe modules' shared Memory Bank — a centralized, allen-wiki-style logging and knowledge system for Foundry VTT module development.
---

# vibe Memory Bank

The persistent, cross-session brain for the **vibe-* Foundry VTT module
suite** (`vibe-common`, `vibe-actor`, `vibe-combat`, and siblings). It lives
here in `vibe-common` because `vibe-common` is the shared dependency every
module imports from. Other modules reference this bank cross-repo via
`../vibe-common/memory-bank/`.

This is your single source of truth for: **what happened** (logs), **what we
know** (knowledge), and **what is in flight** (projects). You have no other
long-term memory for this codebase.

## Areas

- **[logs/](logs/AGENTS.md)** — Daily session logs (`YYYY-MM-DD.md`). The
  project history and session-to-session handover.
- **[knowledge/](knowledge/AGENTS.md)** — Categorized, tagged gotchas and
  patterns. The searchable source of truth for Foundry / AI quirks.
- **[projects/](projects/AGENTS.md)** — One folder per multi-session
  initiative, each with its own AGENTS.md (Status / What & Why / Next Session).
- **[scratch/](scratch/AGENTS.md)** — Ephemeral daily work (`YYYY-MM-DD/`).
  Gitignored. Promote to `projects/` when files prove reusable.

## Session Protocol

Governed by the `memory-bank-protocol` skill at
`vibe-common/.agents/skills/memory-bank-protocol/SKILL.md`.

**Boot (session start):** read this file → the most recent `logs/` entry →
relevant `projects/*/AGENTS.md` → search `knowledge/` by tag for your area.

**Close ("finish session"):** write/append today's `logs/` entry → update
touched `projects/*/AGENTS.md` "Next Session" → add any new gotcha to
`knowledge/` → bump `modified:` dates (verify the real system date first).

## Frontmatter

Every markdown file in the bank uses:

```yaml
---
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags: [foundry-v14, application-v2]
summary: One line so agents judge relevance without reading the body.
module: vibe-common | vibe-actor | vibe-combat | shared
references: [relative/path.md]   # optional
---
```

The `module:` field is Foundry-specific — it tags which module a note
applies to so a central bank stays filterable per module.

## Conventions

- **Dates:** never assume. Check the system date before writing or bumping
  `modified:`.
- **Tags:** lowercase, hyphenated, reused before invented.
- **Knowledge entries:** one focused gotcha/pattern per file, kebab-case name.
- **Check before create:** search existing logs/knowledge/projects first.
- **English only** for code, comments, and memory-bank content.

## Navigation

- [Back to vibe-common AGENTS.md](../AGENTS.md)
- Design spec (local, gitignored): `docs/superpowers/specs/2026-06-06-memory-bank-design.md`
