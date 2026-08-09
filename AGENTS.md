# Agent Instructions & Memory Rules

## Session Rules

1. **Check Memory on Session Start**: At the start of every session, before doing anything else, read `.agent/MEMORY.md`. If it doesn't exist, create it using the template below.

2. **Persistent Context Across Sessions**: Treat `.agent/MEMORY.md` as your persistent context across sessions. Before ending any significant task, update it with:
   - What was built/changed and why
   - Key architectural decisions and the reasoning behind them
   - Known issues, TODOs, or things intentionally left unfinished
   - Any conventions, naming patterns, or file structures established
   - Dependencies added and why

3. **Concise & Skimmable**: Keep `MEMORY.md` concise and skimmable — bullet points, not prose. Prune stale/irrelevant entries instead of letting it grow forever.

4. **No Codebase Duplication**: Never duplicate information already in the codebase (like `package.json`) — only log context that isn't obvious from reading the code itself (decisions, tradeoffs, "why", things tried and abandoned).

---

## Memory Template (`.agent/MEMORY.md`)

```markdown
# Project Memory

## Overview
[1-2 line description of what this project is]

## Architecture Decisions
- 

## Current State
- 

## Known Issues / TODO
- 

## Conventions
- 

## Session Log
- [date]: [what changed]
```
