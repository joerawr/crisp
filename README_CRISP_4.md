# Crisp, explained at level 4

> Demo: level 4 is the default README's register. This file is a clone of
> `README.md` so you can place it in the 1-5 series. Compare against the other
> README_CRISP_*.md files to feel the taper.

A verbosity dial for Claude Code. One number, 1 to 5, sets how much the agent
writes across session prose, MR descriptions, and code comments. Lower says
less. Default is 3.

Crisp is not caveman. No broken grammar, no dropped articles. It stays a clear,
articulate engineer at every level and says only what the reader needs.

## The dial

| Lvl | Prose | ~lines | Code comments |
|-----|-------|-------:|---------------|
| 5 | Full reasoning: assumptions, risks, trade-offs, alternatives | ~40 | explain non-obvious why |
| 4 | Same shape, hedges and restatement cut | ~16 | only where intent is unclear |
| 3 | Answer first, reasoning only where it changes the decision (default) | ~9 | one or two lines, load-bearing |
| 2 | Answer plus one line of why | ~4 | only when code cannot speak |
| 1 | Answer only | ~2 | rare, surgical |

The line counts are soft targets, not caps. A genuinely complex answer runs
longer; a one-word answer runs shorter. The number sets the reflex for how much
reasoning to surface.

## Two layers below the dial, always on

**Humanizer floor** (every level, including 5): no em or en dashes, no rule of
three, no AI-vocab clusters (delve, leverage, robust, seamless, underscore,
tapestry), no signposting, no sycophancy, no negative parallelism. Vary rhythm,
prefer concrete detail. Written clean the first pass, with no separate audit
step that would add latency.

**Safety carve-out** (overrides the dial, even at level 1): never compress
security warnings, mandated inline edge-case or SECURITY-REVIEW comments,
correctness caveats, or risk and blocker flags. Correctness outranks concision.

## Usage

- `/crisp 1|2|3|4|5` sets the level for the session
- `/crisp off`, `stop crisp`, or `normal mode` turns it off
- Default is 3. Override with the `CRISP_DEFAULT_LEVEL` env var or
  `~/.config/crisp/config.json`: `{ "defaultLevel": "2" }`
- The statusline shows `[CRISP:n]`

## How it works

A SessionStart hook writes a flag file and injects the ruleset at the active
level. A UserPromptSubmit hook watches for `/crisp n` and updates both. The
statusline script appends the `[CRISP:n]` badge, and chains onto an existing
statusline if you set `CRISP_INNER_STATUSLINE` to its command.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert,
  for the hook architecture. Ponytail governs what you build; Crisp governs how
  you talk about it.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for
  brevity as a switchable, leveled mode, minus the broken-English persona.
- [humanizer](https://github.com/blader/humanizer), based on Wikipedia's "Signs
  of AI writing" guide, for the humanizer floor (minus its draft-audit loop).

## Test

```
node test.js
```
