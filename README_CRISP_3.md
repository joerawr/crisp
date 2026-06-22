# Crisp, explained at level 3

> Demo: this is the project at level 3, the default. Answer first, reasoning
> only where it changes a decision.

A verbosity dial for Claude Code. Pick a number 1 to 5 and the agent matches how much it writes to how much you want to read. This covers session prose, MR descriptions, and code comments. Default is 3.

Lower says less. It stays clean human English at every level. Level 1 is terse, not caveman, so no dropped articles or broken grammar.

## The dial

| Level | Style | Soft target |
|-------|-------|-------------|
| 5 | Full reasoning, every step shown | ~40 lines |
| 4 | Hedges and qualifiers cut | ~16 lines |
| 3 | Answer first, then the why that matters (default) | ~9 lines |
| 2 | Answer plus one reason | ~4 lines |
| 1 | Answer only | ~2 lines |

Targets are soft, not caps. A real answer that needs more room gets more room. Code comments scale on the same curve.

Pick the level for the moment: 1 or 2 for flow-state edits where you want the payload, 3 for normal work, 4 or 5 for architecture and debugging where you want to check the reasoning.

## Always-on floor

Underneath the dial runs a humanizer that strips AI writing tells at every level: no em or en dashes, no rule of three, no AI-vocab clusters (delve, leverage, robust, seamless), no signposting, no sycophancy, no narrating its own process.

One thing the dial never touches. Security warnings, correctness caveats, and risk flags survive at level 1. Brevity does not get to drop the warning that keeps you out of an outage.

## Usage

- `/crisp 1-5` set the level, `/crisp off` to stop (also "stop crisp", "normal mode")
- Default via `CRISP_DEFAULT_LEVEL` env var
- Statusline shows `[CRISP:n]`

A SessionStart hook injects the ruleset and writes a flag; a UserPromptSubmit hook tracks `/crisp n`.

## Inspirations

ponytail (hook architecture), caveman (leveled brevity, minus the persona),
humanizer (the floor).
