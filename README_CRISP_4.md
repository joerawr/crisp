# Crisp, explained at level 4

> Demo: level 4 is the default README's register, and this file is a clone of
> `README.md` so it sits in the 1-5 series. This duplication is deliberate.

Your agent writes a paragraph when you wanted a sentence. Crisp is a verbosity dial for Claude Code: one number from 1 to 5 that sets how much the agent writes across session prose, MR descriptions, and code comments.

Lower says less. Default is 3. You change it per session, or per task, with `/crisp n`.

## The problem

There is no single right verbosity. Drafting an MR description wants room to explain. A quick status check wants one line. A static instruction file cannot know which one you are doing right now, so it picks an average and the agent drifts long against it. You can write "be concise" in fifty different ways and still get walls of text on a yes/no question.

Crisp moves verbosity out of the instruction file and onto a knob you turn when the task changes.

## The dial

One axis, five stops. Each level has a soft target for how much prose a typical response carries. These are targets, not caps, so a genuinely complex answer can run longer when it has to. Code comments scale on the same axis.

| Level | Style | Prose target |
|-------|-------|--------------|
| 5 | Full reasoning, nothing trimmed | ~40 lines |
| 4 | Hedges and restatement cut | ~16 lines |
| 3 | Answer first, then the load-bearing why (default) | ~9 lines |
| 2 | Answer plus one reason | ~4 lines |
| 1 | Answer only | ~2 lines |

This README sits at level 4 on purpose. Choosing to adopt a tool is worth the fuller pitch, so the docs run long. The daily work that follows wants level 2 or 3. Write docs at 4, work at 2 or 3.

## Two always-on layers

The dial controls quantity. Two layers run underneath it and do not move with the number.

### Humanizer floor

Every level, including 5, strips the tells of machine prose. No em or en dashes. No rule of three. No AI-vocab clusters (delve, leverage, robust, seamless). No signposting, no sycophancy, no negative parallelism, no narrating its own process. Rhythm varies, detail stays concrete. The cleanup happens on the first pass, so there is no audit step and no added latency.

This is not caveman shorthand. Every level reads as clean human English with intact grammar. Level 1 is short, not broken.

### Safety carve-out

Concision stops at correctness. The dial never compresses:

- Security warnings
- Mandated inline edge-case or `SECURITY-REVIEW` comments
- Correctness caveats
- Risk and blocker flags

These survive at level 1 the same as at level 5. When brevity and correctness collide, correctness wins.

## Usage

```
/crisp 4        set the level for this session
/crisp 2        drop to terse for the next stretch of work
/crisp off      disable (also: "stop crisp", "normal mode")
```

The statusline shows the active level as `[CRISP:n]` so you always know where the dial sits.

## Config

Set a default so every session starts where you want it. Put this in your shell profile:

```bash
export CRISP_DEFAULT_LEVEL=2
```

Absent that, the default is 3.

## Install

Requires Node.

```
/plugin marketplace add joerawr/crisp
/plugin install crisp@crisp
```

If you would rather wire it by hand, register a `SessionStart` hook (`crisp-activate.js`) and a `UserPromptSubmit` hook (`crisp-tracker.js`) in `~/.claude/settings.json`. The plugin install does the same thing for you.

## How it works

Three pieces, all hooks, no background process and no network calls:

- **SessionStart hook** writes a flag file and injects the ruleset for the active level into the session.
- **UserPromptSubmit hook** watches for `/crisp n` and updates the active level when you change it mid-session.
- **Statusline script** appends `[CRISP:n]` to your statusline. It chains with any statusline you already run through `CRISP_INNER_STATUSLINE`, so it adds to your setup rather than replacing it.

The level lives in a flag file rather than in conversation history, which is why changing it takes effect immediately and survives across turns.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert, for the hook architecture. The two pair cleanly: ponytail governs what you build, Crisp governs how you talk about it.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for treating brevity as a leveled, switchable mode. Crisp keeps the levels and drops the broken-English persona.
- [humanizer](https://github.com/blader/humanizer), based on Wikipedia's "Signs of AI writing" guide, for the floor. Crisp folds it into the first pass instead of running a separate draft-audit-final loop.
