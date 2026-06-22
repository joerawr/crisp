# Crisp

```
 ██████╗██████╗ ██╗███████╗██████╗
██╔════╝██╔══██╗██║██╔════╝██╔══██╗
██║     ██████╔╝██║███████╗██████╔╝
██║     ██╔══██╗██║╚════██║██╔═══╝
╚██████╗██║  ██║██║███████║██║
 ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝

      a verbosity dial for your agent
```

Your agent writes a paragraph when you wanted a sentence. Crisp is a verbosity dial for Claude Code: one number from 1 to 5 that sets how much the agent writes across session prose, MR descriptions, and code comments.

Lower says less. Default is 3. You change it per session, or per task, with `/crisp n`.

## The problem

There is no single right verbosity. Drafting an MR description wants room to explain. A quick status check wants one line. A static instruction file cannot know which one you are doing right now, so it picks an average and the agent drifts long against it. You can write "be concise" in fifty different ways and still get walls of text on a yes/no question.

Crisp moves verbosity out of the instruction file and onto a knob you turn when the task changes.

## Same question, two levels

Prompt: "Explain how a token bucket rate limiter works, and when to choose it over a fixed-window limiter."

At level 1:

> A token bucket holds up to N tokens that refill at a steady rate; each request spends one, and when the bucket is empty requests are dropped or queued until tokens accrue. Choose it over a fixed-window limiter when you need to absorb short bursts while capping the long-run average, instead of the hard per-window cutoff that lets double the limit slip through across a window boundary.

At level 5 the same answer keeps the mechanism, then adds the refill math, the boundary-burst failure case, distributed-state and clock-skew edge cases, and when each limiter is the wrong choice. Around 300 words instead of 70. Neither one hedges, signposts, or pads. The dial changed how much got said, not how it reads.

## What the dial actually does to length

Measured word counts for that prompt, one answer per level, humanizer floor on throughout:

| Level | Words |
|-------|------:|
| 1 | 67 |
| 2 | 70 |
| 3 | 150 |
| 4 | 230 |
| 5 | 304 |

Two honest notes. The counts are a single sample on one question, not a benchmark suite, so read them as the shape of the curve, not a guarantee. And levels 1 and 2 nearly tie here because the prompt has two parts ("how it works" and "when to choose it"), and a correct answer to both has a floor of about two sentences. On a single-part question the 1-to-2 gap opens up. Targets are soft for exactly this reason.

## The dial

One axis, five stops. Each level has a soft target for how much prose a typical response carries. These are targets, not caps, so a genuinely complex answer can run longer when it has to. Code comments scale on the same axis.

| Level | Style | Prose target |
|-------|-------|--------------|
| 5 | Full reasoning, nothing trimmed | ~40 lines |
| 4 | Hedges and restatement cut | ~16 lines |
| 3 | Answer first, then the load-bearing why (default) | ~9 lines |
| 2 | Answer plus one reason | ~4 lines |
| 1 | Answer only | ~2 lines |

This README sits at level 4 on purpose. Choosing to adopt a tool is worth the fuller pitch, so the docs run long. The daily work that follows wants level 2 or 3. Write docs at 4, work at 2 or 3. The `README_CRISP_1.md` through `README_CRISP_5.md` files show this same README rewritten at each level, and `README_CRISP_OFF.md` shows what the default agent produces with no dial at all.

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

Set a default so every session starts where you want it:

```bash
export CRISP_DEFAULT_LEVEL=2
```

Or in `~/.config/crisp/config.json`:

```json
{ "defaultLevel": "2" }
```

Absent either, the default is 3.

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
- **UserPromptSubmit hook** does two jobs. On `/crisp n` it updates the flag and blocks the prompt, so the switch costs no model turn and no tokens, it is instant. On your next real prompt it re-injects the ruleset once, so a mid-session change takes effect without paying for a turn per switch. Other prompts pass through untouched.
- **Statusline script** appends `[CRISP:n]` to your statusline. It chains with any statusline you already run through `CRISP_INNER_STATUSLINE`, so it adds to your setup rather than replacing it.

The level lives in a flag file rather than in conversation history, which is why changing it takes effect immediately and survives across turns.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert, for the hook architecture. The two pair cleanly: ponytail governs what you build, Crisp governs how you talk about it.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for treating brevity as a leveled, switchable mode. Crisp keeps the levels and drops the broken-English persona.
- [humanizer](https://github.com/blader/humanizer), based on Wikipedia's "Signs of AI writing" guide, for the floor. Crisp folds it into the first pass instead of running a separate draft-audit-final loop.

## Test

```
node test.js
```

## License

[MIT](LICENSE).
