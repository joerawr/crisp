# Crisp, explained at level 5

> Demo: this is the project explained as a level-5 (full reasoning) response
> would read. Full does not mean long for its own sake: this lands around 30
> lines because that is what the reasoning needs, not to fill a quota. Compare
> it against `README_CRISP_1.md` through `_4.md` to see the taper.

A verbosity dial for Claude Code. One number, 1 to 5, sets how much the agent writes across session prose, MR descriptions, and code comments. Lower says less. The default is 3.

## Why it exists

Coding agents drift verbose. You can write a CLAUDE.md that asks for concision and the agent will still restate your question back to you, hedge every claim, and grow a two-line comment into eight. A static file cannot fix this, because there is no single correct verbosity. A design review wants the full chain of reasoning so you can check it. A syntax lookup wants one line. A file that bakes in either setting is wrong half the time, and the agent cannot infer which half it is in. So the right unit of control is the session, not the file, and the right interface is a knob you turn.

## Length and voice are different problems

The insight the whole tool rests on: length and voice are separate axes, and conflating them is why "be concise" instructions fail. Telling an agent to write less makes it clip articles and drop the reasoning you wanted. Telling it to write well does nothing about length.

So Crisp splits them. The dial controls length only. A separate humanizer floor, on at every level, controls voice. The payoff is that a long answer is still a clean answer. Level 5 gives you forty lines of real reasoning without the em dashes, the rule of three, the "delve" and "leverage" filler, or the sycophantic opener that usually come bundled with length. The floor runs in the first pass with no audit step after, because an always-on tool that taxed every turn with latency would not stay on.

This is also why Crisp is not caveman. Caveman proved brevity can be a switchable, leveled mode, which is the idea Crisp keeps. It paid for compression with broken grammar and a persona, which trades communication for a bit. Crisp keeps the leveling and keeps clean English.

## The dial

| Lvl | Prose | ~lines | Code comments |
| --- | --- | --- | --- |
| 5 | full reasoning: assumptions, risks, trade-offs, alternatives | ~40 | explain the non-obvious why |
| 4 | same shape, hedges and restatement cut | ~16 | only where intent is unclear |
| 3 | answer first, reasoning where it changes the decision (default) | ~9 | one or two load-bearing lines |
| 2 | answer plus one line of why | ~4 | only when code cannot speak for itself |
| 1 | answer only | ~2 | rare, surgical |

The line counts are soft targets, not caps. A genuinely hard answer at level 2 runs long; a one-word answer at level 5 stays short. The number sets a reflex for how much reasoning to surface, not a budget to spend.

## Safety overrides the dial

One rule sits above everything, including level 1: never compress a security warning, a mandated inline edge-case or SECURITY-REVIEW comment, a correctness caveat, or a risk or blocker flag. If a low level would force one of those out, the answer runs longer instead. Correctness outranks concision, and the dial does not get a vote.

## Usage

- `/crisp 1|2|3|4|5` sets the level for the session.
- `/crisp off`, `stop crisp`, or `normal mode` turns it off.
- Set the default with the `CRISP_DEFAULT_LEVEL` env var.
- The statusline shows `[CRISP:n]`.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert, for the hook architecture and the build-versus-talk split. Ponytail governs what you build; Crisp governs how you talk about it.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for brevity as a switchable, leveled mode, minus the persona.
- [humanizer](https://github.com/blader/humanizer), built on Wikipedia's "Signs of AI writing" guide, for the floor, minus its draft-audit loop.
