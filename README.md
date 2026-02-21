# Vibe Common

## Overview
**Vibe Common** is the foundational library for the Vibe Project, a suite of AI-powered modules for Foundry VTT. It serves as the shared runtime dependency for `vibe-combat`, `vibe-actor`, and `vibe-scenes`.

This module does not provide user-facing features on its own. Instead, it centralizes core logic, constants, and API services to ensure consistency and reduce code duplication across the ecosystem.

## Project Structure
The Vibe Project consists of the following modules:

-   **`vibe-common`**: (This module) Shared code, constants, math, API helpers.
-   **`vibe-combat`**: Encounter management, XP budgeting, AI encounter suggestions.
-   **`vibe-actor`**: AI NPC generation, adjustment of existing actors, OpenAI image generation.
-   **`vibe-scenes`**: Procedural dungeon generation, AI asset placement, and scene import.
## Features
- **Shared API Services**: Centralized Gemini API clients, context handling, and SSE streaming utilities.
- **Vibe UI Shell**: Provides cohesive base application classes (`VibeApplicationV2`), pre-styled components (animated toggles, clean selects), and a premium sliding `VibeToast` notification system utilized across all Vibe modules.

## Installation
This module is automatically required by `vibe-combat`, `vibe-actor`, and `vibe-scenes`. Ensure it is installed and enabled in your Foundry VTT world.

## Configuration
Go to **Settings -> Configure Settings -> Vibe Common**:

-   **Gemini API Key**: Required for AI generation in `vibe-combat`, `vibe-actor`, and `vibe-scenes`.
-   **OpenAI API Key**: Required for image generation in `vibe-actor`.

All Vibe modules share these centralized API keys, so you only need to configure them once.

---

## Developer Guide

For information on the module's architecture, API clients, shared data, CSS tokens, and hooks, please see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Future Work & Roadmap

### Common Code Expansion
-   **Unified Settings Manager**: A centralized way to manage API keys and shared preferences across all Vibe modules.
-   **Enhanced Error Handling**: A global error reporting system to catch and log AI-related failures more effectively.

### Large Scale Refactoring
-   **Service Injection**: Move towards a dependency injection pattern for clearer service management.
-   **Type Safety**: Continue migrating core logic to JSDoc/TypeScript for better developer tooling support.
