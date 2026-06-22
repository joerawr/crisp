# Crisp, explained at level 1

> Demo: level 1. Answer only.

Crisp is a verbosity dial for Claude Code: one number from 1 to 5 sets how much the agent writes across session prose, MR descriptions, and code comments, where 5 is full reasoning (~~40 lines), 3 is answer-first (~~9 lines, the default), and 1 is answer only (~2 lines). Two layers stay on under the dial regardless of level: a humanizer floor (no em/en dashes, no rule of three, no AI-vocab clusters, no signposting, no sycophancy, no process narration) and a safety carve-out that never compresses security warnings, correctness caveats, risk or blocker flags, or mandated inline comments.

Usage: `/crisp 1-5`, or `/crisp off` (also "stop crisp" / "normal mode"); set a default via `CRISP_DEFAULT_LEVEL`, and the statusline shows `[CRISP:n]`. Inspired by ponytail (hook architecture), caveman (leveled brevity, minus the broken-English persona), and humanizer (the floor).