---
created: 2026-06-06
modified: 2026-06-07
tags: [meta, projects, memory-bank]
summary: Persistent multi-session initiative folders for the vibe modules. Each project folder has its own AGENTS.md with Status, What & Why, and Next Session handover.
---

# Projects

Persistent folders for work that spans multiple sessions across the vibe-*
modules. This replaces the old single global `current-state.md` /
`NOTES_NEXT_SESSION.md` — handover now lives per-project so it can't rot in
one central file.

## What Belongs Here

- Features or initiatives worked on over more than one session
- Anything that graduated from `scratch/` because it became real
- Work that needs explicit "where I left off" handover between sessions

## Project Folder Structure

Each project folder contains an `AGENTS.md` with at least:

- **Status** — active / blocked / done, and the current phase
- **What & Why** — what is being built and the reasoning
- **Next Session** — concrete instructions for the next agent to pick up
- A link back to this document

Plus any project files (plans, notes, fixtures) as needed.

## Current Projects

- **[vibe-scene-two-hardening/](vibe-scene-two-hardening/AGENTS.md)** — _complete (2026-06-07), shipped v2.0.0._
  Brought `vibe-scene-two` (the SVG-planning scene pipeline) up to sibling
  production level (Foundry v14, correctness/robustness fixes) and made it THE
  canonical scenes module. Keeps the `vibe-scene-two` id (no rename).

## Navigation

- [Back to memory-bank AGENTS.md](../AGENTS.md)
