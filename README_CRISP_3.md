# Crisp, explained at level 3

> Demo: this is the project at level 3, the default. Answer first, reasoning
> only where it changes a decision.

A verbosity dial for Claude Code. One number, 1 to 5, sets how much the agent
writes across prose, MR descriptions, and code comments. Lower says less.
Default 3. It is not caveman: clean English at every level, no broken grammar.

## The dial

| Lvl | Prose | ~lines |
|-----|-------|-------:|
| 5 | full reasoning | ~40 |
| 4 | hedges cut | ~16 |
| 3 | answer first, reasoning where it changes the decision | ~9 |
| 2 | answer plus one why | ~4 |
| 1 | answer only | ~2 |

Counts are soft targets. Code comments scale the same way, from "explain the
why" at 5 to "rare and surgical" at 1.

Two layers run under the dial at every level. A humanizer floor strips AI
writing tells (no em dashes, no rule of three, no signposting or sycophancy). A
safety carve-out keeps security warnings, correctness caveats, and risk flags
from being compressed, even at level 1.

## Usage

- `/crisp 1|2|3|4|5`, or `/crisp off`
- Default set by `CRISP_DEFAULT_LEVEL` or `~/.config/crisp/config.json`
- Statusline shows `[CRISP:n]`

A SessionStart hook injects the ruleset and writes a flag; a UserPromptSubmit
hook tracks `/crisp n`.

## Inspirations

ponytail (hook architecture), caveman (leveled brevity, minus the persona),
humanizer (the floor).
