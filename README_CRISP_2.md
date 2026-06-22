# Crisp, explained at level 2

> Demo: level 2. Answer plus one line of why.

Verbosity dial for Claude Code. One number, 1 to 5, sets how much the agent writes: session prose, MR descriptions, code comments. Lower says less. Default 3.

Clean human English at every level. Level 1 is terse, not broken grammar.

## Dial

| Level | Style | Prose target | Comments |
|-------|-------|--------------|----------|
| 5 | Full reasoning | ~40 lines | Full |
| 4 | Hedges cut | ~16 lines | Trimmed |
| 3 | Answer-first (default) | ~9 lines | Lean |
| 2 | Answer plus one why | ~4 lines | Sparse |
| 1 | Answer only | ~2 lines | Minimal |

Targets are soft. Comments scale with prose.

## Commands

```
/crisp 1-5      set the level
/crisp off      back to normal output
```

Also accepts "stop crisp" and "normal mode".

## Always on

A humanizer floor runs at every level and strips AI writing tells. A safety carve-out never compresses security, correctness, or risk flags, even at level 1. Less prose, same warnings.

## Config

- `CRISP_DEFAULT_LEVEL` env var sets the startup default.
- Statusline shows `[CRISP:n]`.

## Lineage

- ponytail: hook architecture.
- caveman: leveled brevity, dropped the broken-English persona.
- humanizer: the always-on floor.
