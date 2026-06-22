# Crisp, explained at level 2

> Demo: level 2. Answer plus one line of why.

Verbosity dial for Claude Code, 1 to 5, across prose, MR descriptions, and code
comments. Lower says less, default 3. Clean English, not caveman.

| Lvl | ~lines |
|-----|-------:|
| 5 | ~40 |
| 4 | ~16 |
| 3 | ~9 |
| 2 | ~4 |
| 1 | ~2 |

A humanizer floor and a safety carve-out run at every level: the floor strips
AI writing tells, the carve-out never compresses security or correctness.

`/crisp n` to switch, `/crisp off` to stop. Statusline shows `[CRISP:n]`.

Inspired by ponytail, caveman, and humanizer.
