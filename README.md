# Crisp

```
 ██████╗██████╗ ██╗███████╗██████╗
██╔════╝██╔══██╗██║██╔════╝██╔══██╗
██║     ██████╔╝██║███████╗██████╔╝
██║     ██╔══██╗██║╚════██║██╔═══╝
╚██████╗██║  ██║██║███████║██║
 ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝

  a crispness dial for your agent
```

Your agent writes a paragraph when you wanted a sentence. Crisp is a verbosity dial for Claude Code: one number from 1 to 5 that sets how much the agent writes across session prose, MR descriptions, and code comments.

Lower says less. Change it on the fly, no context reload: a level per session with `/crisp n`, or a single answer at a named level by asking for it in the prompt. Fewer tokens are a byproduct. The real point is the dial, *crispest* to *fullest*, twisted where you want it.

```
give me the crisp 2 summary of the fix we implemented in this session
```

That asks for one terse answer without touching your session level. The next prompt is back to wherever the dial was.

## The problem

There is no single right verbosity. Drafting an MR description wants room to explain. A quick status check wants one line. A static instruction file cannot know which one you are doing right now, so it picks an average and the agent drifts long against it. You can write "be concise" in fifty different ways and still get walls of text on a yes/no question.

Crisp is the knob that dials in the crispness you want for the session, task, or documents.

## The same question at different levels

Three prompts, each shown at level 1, then what level 5 adds on top.

**"What is Claude Code?"**

At level 1:

> Claude Code is Anthropic's agentic coding tool, powered by the Claude models. It runs in a terminal CLI, a Mac/Windows desktop app, the web at claude.ai/code, and VS Code and JetBrains extensions. It reads and edits files, runs shell commands, uses tools, spawns subagents, and supports hooks, slash-command skills, and MCP servers, driving multi-step tasks from plain-language prompts.

At level 5 the same answer keeps that, then adds what it does on a task in more detail, the model family it runs on, and when reaching for an agent beats a single prompt. 58 words at level 1, 259 at level 5.

**"TL;DR of Karpathy's LLM Wiki"**

At level 1:

> Karpathy's LLM Wiki has an LLM build and maintain a persistent, linked markdown wiki from your sources, instead of re-retrieving raw documents per query the way classic RAG does. Knowledge compounds: each source is synthesized once and kept current, and the LLM handles the cross-referencing and upkeep, so maintenance cost is near zero.

At level 5 the same answer keeps that, then adds the three-layer architecture (immutable raw sources, the LLM-generated wiki, a schema doc that governs structure), the operations (ingest, query, lint for contradictions and gaps), the `index.md` and `log.md` navigation files, optional Obsidian and CLI tooling, and the thesis that the human directs the analysis while the LLM does the bookkeeping. 53 words at level 1, 265 at level 5.

**"Explain input tokens vs output tokens and how cache reads affect my api bill"**

At level 1:

> Input tokens are everything you send: system prompt, conversation history, tool definitions, and the user's question. Output tokens are what the model generates back. Output costs more per token: Claude Opus 4.8 is $5 per million input and $25 per million output.
>
> Prompt caching matches a prefix. A cache read on that prefix bills at about 0.1x the normal input rate; in the usage object it shows as `cache_read_input_tokens`, while `input_tokens` is the uncached remainder at full price. Writing the cache costs about 1.25x input (5-minute TTL) or 2x (1-hour TTL). Any byte change in the cached prefix invalidates it, and you pay full price again.

At level 5 the same answer keeps that, then adds worked cost math, the prefix-placement rules that keep the cache warm, the silent invalidators to watch for, and how to confirm hits in the `usage` fields. Here is that prompt measured at every level, plus `off` for no dial at all:

| Crisp | Words |
|-------|------:|
| 1 | 106 |
| 2 | 126 |
| 3 | 231 |
| 4 | 272 |
| 5 | 500 |
| off | 335 |

One run per level, humanizer floor on throughout. For this file the curve climbs the whole way. Level 5 runs longer than off because off is just the model's default length, while level 5 surfaces every assumption and edge case, so the verbose end of the dial says more than no dial at all.

There is a quality gap too. The off answers here leaked em and en dashes, the machine-prose tell the floor strips, while every level-5 answer stayed crisp and clean. The floor runs at every level, so even the most verbose setting reads cleaner than no dial at all. Length is what the dial moves; the floor is what stays fixed under it.

Single sample, soft targets, not a benchmark suite.

## The dial

One axis, five stops. Each level has a soft target for how much prose a typical response carries. These are targets, not caps, so a genuinely complex answer can run longer when it has to. Code comments scale on the same axis.

| Level | Style | Prose target |
|-------|-------|--------------|
| 5 | Full. Full reasoning, nothing trimmed | ~40 lines |
| 4 | Fuller. Hedges and restatement cut | ~16 lines |
| 3 | Crisp. Answer first, then the load-bearing why | ~9 lines |
| 2 | Crisper. Answer plus one reason | ~4 lines |
| 1 | Crispest. Answer only | ~2 lines |

Docs earn the fuller pitch and run long, so write them at 4. The daily work that follows wants 2 or 3.

## Two always-on layers

The dial sets how crisp; the floor keeps it clean. Two layers run underneath it and do not move with the number.

### Humanizer floor

Every level, including 5, reads crisp. The floor strips the tells of machine prose. No em or en dashes. No rule of three. No AI-vocab clusters (delve, leverage, robust, seamless). No signposting, no sycophancy, no negative parallelism, no narrating its own process. Rhythm varies, detail stays concrete. The cleanup happens on the first pass, so there is no audit step and no added latency.

This is not caveman shorthand. Every level is crisp and clean human English, with intact grammar. Level 1 is short, not broken.

### Safety carve-out

Brevity stops at correctness. The dial never compresses:

- Security warnings
- Mandated inline edge-case or `SECURITY-REVIEW` comments
- Correctness caveats
- Risk and blocker flags

These survive at level 1 the same as at level 5. When brevity and correctness collide, correctness wins. This is also where a low level can run longer than its target: when you see more lines than you expected at level 1 or 2, that is the agent judging those lines essential to keep the answer correct, not the dial drifting.

## Usage

```
/crisp 4        set the level for this session
/crisp 2        drop to terse for the next stretch of work
/crisp off      disable (also: "stop crisp", "normal mode")
```

With the optional statusline wired up (see Install), an `[CRISP:n]` badge shows the active level so you always know where the dial sits.

## Config

Set a default so every session starts where you want it. Put this in your shell profile:

```bash
export CRISP_DEFAULT_LEVEL=2
```

Absent that, the default is 3.

## Install

Requires Node. The optional statusline badge also needs Python 3.

```
/plugin marketplace add joerawr/crisp
/plugin install crisp@crisp
```

### Statusline badge (optional)

Installing the plugin wires the hooks but not the statusline. Claude Code allows
only one `statusLine` command, so Crisp will not claim it for you. To show the
`[CRISP:n]` badge, point `statusLine` at the bundled script in your settings:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/plugins/cache/crisp/crisp/<version>/hooks/crisp-statusline.sh"
  }
}
```

Replace `<version>` with the installed version (`claude plugin list` shows it).
If you already run a statusline, chain it instead of replacing it: set
`CRISP_INNER_STATUSLINE` to your existing command and the script forwards the
session JSON to it first, then appends the badge.

## First, check your CLAUDE.md

If your `CLAUDE.md` already tells the agent to be concise, brief, or terse, that language and Crisp are in the same lane and will pull against each other. Crisp is a live dial; a static "always be brief" line cannot move, so the two send mixed signals.

Before you test drive Crisp, hand the conflict to your agent. Ask it to:

> Read my CLAUDE.md and move any verbosity, brevity, or response-length rules into a backup file. Crisp owns that now. Leave everything else.

Then run a session with Crisp alone and see how the dial feels without a second voice arguing about length. Put the rules back if you decide you want them.

## How it works

Three pieces, all hooks, no background process and no network calls:

- **SessionStart hook** writes a flag file and injects the ruleset for the active level into the session.
- **UserPromptSubmit hook** does two jobs. On `/crisp n` it updates the flag and blocks the prompt, so the switch costs no model turn and no tokens, it is instant. On your next real prompt it re-injects the ruleset once, so a mid-session change takes effect without paying for a turn per switch. Other prompts pass through untouched.
- **Statusline script** (optional, wired by hand) appends `[CRISP:n]` to your statusline. It chains with any statusline you already run through `CRISP_INNER_STATUSLINE`, so it adds to your setup rather than replacing it.

The level lives in a flag file rather than in conversation history, which is why changing it takes effect immediately and survives across turns. The flag is keyed by session id (`.crisp-active-<id>`), so two terminals hold independent levels.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert, for the hook architecture. The two pair cleanly: ponytail governs what you build, Crisp governs how you talk about it.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for treating brevity as a leveled, switchable mode. Crisp keeps the levels and drops the broken-English persona for clean, crisp output.
- [humanizer](https://github.com/blader/humanizer), based on Wikipedia's "Signs of AI writing" guide, for the floor. Crisp folds it into the first pass instead of running a separate draft-audit-final loop.

## License

[MIT](LICENSE).
