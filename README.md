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

## Key Components

### 1. Shared Constants & Data
-   Centralized definitions for CR/XP values (`XP_BY_CR`, `CR_BY_XP`).
-   Common data schemas and type definitions.

### 2. API Services
-   **Gemini Service**: A robust wrapper for Google's Gemini API, handling authentication, request structure, and response parsing.
-   **Asset Library**: Shared logic for managing and querying generated assets (used by `vibe-scenes` and potentially others).

### 3. Utility Helpers
-   **Actor Helpers**: Functions for safe actor data manipulation (e.g., `updateActorData`, `getActorCR`).
-   **XP Calculator**: Standardized math for calculating encounter difficulty and daily budgets.

## Future Work & Roadmap

### Common Code Expansion
-   **Unified Settings Manager**: A centralized way to manage API keys and shared preferences across all Vibe modules.
-   **Enhanced Error Handling**: A global error reporting system to catch and log AI-related failures more effectively.
-   **Theme System**: A shared theming engine to allow consistent UI styling across all module dialogs.

### Large Scale Refactoring
-   **Service Injection**: Move towards a dependency injection pattern for clearer service management.
-   **Type Safety**: Continue migrating core logic to JSDoc/TypeScript for better developer tooling support.

## Lessons Learned

### API Limits & Async Handling
-   **Rate Limiting**: AI services (Gemini, OpenAI) have strict rate limits. Implementing exponential backoff and localized queuing is critical for a smooth user experience.
-   **Async UI**: Foundry's UI is synchronous by default. Heavy AI operations must be handled asynchronously with proper loading states to prevent freezing the main thread.

### Module Dependencies
-   **Shared ownership**: Moving shared logic to `vibe-common` was essential to prevent circular dependencies and version mismatches between `vibe-combat` and `vibe-actor`.
-   **Hook Management**: Clear separation of hooks (e.g., `renderCombatTracker` vs `renderActorDirectory`) prevents modules from stepping on each other's toes.

## Installation
This module is automatically required by `vibe-combat` and `vibe-actor`. Ensure it is installed and enabled in your Foundry VTT world.
