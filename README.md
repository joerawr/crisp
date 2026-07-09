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

[![Last Commit](https://img.shields.io/github/last-commit/joerawr/crisp?style=flat)](https://github.com/joerawr/crisp/commits/main) [![License](https://img.shields.io/github/license/joerawr/crisp?style=flat)](LICENSE)

**Same question: 53 words at level 1, 444 at level 5, 649 with no dial at all. One command moves it.**

Your agent writes a paragraph when you wanted a sentence. Crisp is a verbosity dial for Claude Code: one number from 1 to 5 that sets how much the agent writes across session prose, MR descriptions, and code comments. Lower says less. Change it on the fly, no context reload. Fewer tokens are a byproduct; the real point is the dial, *crispest* to *fullest*, twisted where you want it.

## See it

**"TL;DR of Karpathy's LLM Wiki"** at level 1, 53 words:

> Instead of RAG re-deriving answers from raw documents on every query, have an LLM agent incrementally build and maintain a persistent, interlinked markdown wiki: it ingests each source once, updates entity and topic pages, flags contradictions, and files good answers back in, so knowledge compounds while you just curate sources and ask questions.

The same question at level 5, 444 words:

<details>
<summary>Expand the level 5 answer</summary>

> **Core idea.** RAG rediscovers knowledge from scratch on every query: retrieve chunks, synthesize, discard. The LLM wiki pattern replaces that with a persistent, compounding artifact. The LLM incrementally builds and maintains an interlinked collection of markdown files sitting between you and the raw sources. Each new source gets read once, its key information integrated: entity pages updated, syntheses revised, contradictions with older claims flagged. Cross-references exist before you ask the question. You never write the wiki yourself; the LLM does all the summarizing, filing, and bookkeeping. In the author's setup, the LLM agent runs on one side and Obsidian on the other: Obsidian is the IDE, the LLM the programmer, the wiki the codebase.
>
> **Architecture.** Three layers:
>
> 1. **Raw sources**: your curated documents (articles, papers, images). Immutable; the source of truth.
> 2. **The wiki**: LLM-generated markdown (summaries, entity and concept pages, comparisons, synthesis). The LLM owns this layer; you read it.
> 3. **The schema**: a CLAUDE.md/AGENTS.md defining structure, conventions, and workflows. This is what turns a generic chatbot into a disciplined maintainer. You and the LLM co-evolve it.
>
> **Operations.** Three verbs:
>
> - **Ingest**: drop a source, the LLM summarizes, updates the index, touches relevant pages (10-15 per source is normal), logs the entry. One-at-a-time with supervision or batched, your call.
> - **Query**: the LLM reads the index, drills into pages, answers with citations. Good answers get filed back into the wiki, so explorations compound like sources do.
> - **Lint**: periodic health checks for contradictions, stale claims, orphan pages, missing cross-references, gaps worth a web search.
>
> **Navigation.** Two special files: `index.md`, a categorized catalog with one-line summaries, updated on every ingest and read first at query time (works fine at ~100 sources without embedding infrastructure); and `log.md`, an append-only timeline with grep-friendly prefixes like `## [2026-04-02] ingest | Title`.
>
> **Tooling and tips.** Optional CLI tools as scale grows, e.g. [qmd](https://github.com/tobi/qmd) for hybrid BM25/vector search with CLI and MCP interfaces. Obsidian Web Clipper for capturing sources, local image downloads so links don't rot, graph view for spotting hubs and orphans, Marp for slides, Dataview for frontmatter queries. The whole thing is a git repo, so history and collaboration come free.
>
> **Why it works.** Humans abandon wikis because bookkeeping grows faster than value. LLMs don't get bored and can update 15 files in one pass, so maintenance cost drops to near zero. The human curates, directs, and asks questions; the LLM does everything else. It is a Memex (Vannevar Bush, 1945) where the unsolved maintenance problem is finally handled.
>
> **Caveat.** The document is intentionally abstract: everything is optional and modular. Share it with your agent and instantiate a version fitted to your domain.

</details>

Same source, same session, one dial turn apart. The facts survive at every stop; the dial only moves how much surrounds them.

The same question with the dial off runs 649 words and leaks 17 em dashes, the machine-prose tell the floor strips. Level 5 says more than you'd ever trim by hand and still reads like a person wrote it; off says even more and reads like a model did.

<details>
<summary>Expand the dial-off answer (649 words, 17 em dashes)</summary>

> **LLM Wiki** is a pattern for building personal knowledge bases with LLMs. The document is intentionally abstract — it's meant to be handed to your own LLM agent (Claude Code, Codex, etc.), which then collaborates with you to build a concrete implementation suited to your domain.
>
> **The core idea**
>
> Traditional RAG systems (NotebookLM, ChatGPT file uploads) retrieve chunks from raw documents at query time and re-derive answers from scratch on every question — nothing accumulates. The LLM Wiki pattern inverts this: the LLM **incrementally builds and maintains a persistent, interlinked wiki of markdown files** that sits between you and the raw sources. When a new source arrives, the LLM reads it and *integrates* it — updating entity pages, revising syntheses, flagging contradictions with earlier claims. Knowledge is compiled once and kept current, making the wiki a compounding artifact that grows richer with every source and every question.
>
> The division of labor: you curate sources, explore, and ask good questions; the LLM does all the writing, summarizing, cross-referencing, and bookkeeping. The author's workflow pairs an LLM agent with Obsidian side by side — "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."
>
> **Use cases:** personal tracking (goals, health, journals), long-term research, reading companion wikis for books (think Tolkien Gateway, built solo as you read), team knowledge bases fed by Slack and meeting transcripts, competitive analysis, trip planning, course notes, and hobby deep-dives.
>
> **Architecture**
>
> Three layers:
>
> 1. **Raw sources** — immutable curated documents; the source of truth. The LLM reads but never modifies them.
> 2. **The wiki** — LLM-generated and LLM-owned markdown: summaries, entity pages, concept pages, comparisons, an overview, a synthesis.
> 3. **The schema** — a config document (CLAUDE.md / AGENTS.md) defining structure, conventions, and workflows. This is what turns a generic chatbot into a disciplined wiki maintainer; you and the LLM co-evolve it over time.
>
> **Operations**
>
> - **Ingest** — drop a source in, and the LLM reads it, discusses takeaways, writes a summary page, updates the index and 10–15 related pages, and appends a log entry. Do it one source at a time with supervision, or batch with less oversight.
> - **Query** — the LLM searches the wiki, reads relevant pages, and synthesizes cited answers in whatever form fits (markdown, comparison tables, Marp slides, charts). Key insight: good answers should be **filed back into the wiki**, so your explorations compound too.
> - **Lint** — periodic health checks for contradictions, stale claims, orphan pages, missing pages and cross-references, and data gaps worth researching.
>
> **Supporting structure**
>
> - **index.md** — a content-oriented catalog of every page with one-line summaries, organized by category. Read first at query time; works surprisingly well up to ~100 sources / hundreds of pages, avoiding embedding-based RAG infrastructure.
> - **log.md** — an append-only chronological record of ingests, queries, and lint passes, with grep-friendly entry prefixes.
> - **Optional CLI tools** — as the wiki grows, add proper search (e.g. [qmd](https://github.com/tobi/qmd), a local hybrid BM25/vector search engine with CLI and MCP interfaces), or vibe-code something simpler.
> - **Tips** — Obsidian Web Clipper for capturing articles, downloading images locally so the LLM can view them, graph view for spotting hubs and orphans, Marp for slides, Dataview for frontmatter queries, and git for free version history and collaboration.
>
> **Why it works**
>
> The tedious part of a knowledge base isn't reading or thinking — it's the bookkeeping. Humans abandon wikis because maintenance burden outgrows value; LLMs don't get bored, don't miss cross-references, and can touch 15 files in one pass, driving maintenance cost to near zero. The document frames this as the realization of Vannevar Bush's Memex (1945) — a private, curated knowledge store with associative trails — with the LLM finally solving the maintenance problem Bush couldn't.
>
> Everything in the pattern is optional and modular: pick what fits your domain and let your LLM agent instantiate the rest.

</details>

The same prompt measured at every stop, plus `off` for no dial at all:

| Crisp | Words | Em/en dashes |
|-------|------:|-------------:|
| 1 | 53 | 0 |
| 2 | 96 | 0 |
| 3 | 174 | 0 |
| 4 | 286 | 0 |
| 5 | 444 | 0 |
| off | 649 | 17 |

The curve climbs the whole way and stays clean at every stop; off is both the longest and the only one that leaks the machine-prose tells the floor strips. Single sample per level, soft targets, not a benchmark suite. More examples in [The same question at different levels](#the-same-question-at-different-levels).

## Install

Requires Node.

```
/plugin marketplace add joerawr/crisp
/plugin install crisp@crisp
```

## Usage

```
/crisp 4        set the level for this session
/crisp 2        drop to terse for the next stretch of work
/crisp off      disable (also: "stop crisp", "normal mode")
```

You can also ask for a single answer at a named level without touching the session:

```
give me the crisp 2 summary of the fix we implemented in this session
```

The next prompt is back to wherever the dial was.

When you run `/crisp n`, Claude Code shows a yellow "UserPromptSubmit operation blocked by hook" notice. That is expected, not an error: the command never reaches the model. The hook intercepts it, updates the level, and blocks the prompt, which is exactly why the switch is instant and costs zero tokens.

Set a default so every session starts where you want it (absent this, the default is 3):

```bash
export CRISP_DEFAULT_LEVEL=2
```

With the optional statusline wired up (see below), a `[CRISP:n]` badge shows the active level so you always know where the dial sits.

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

## The problem

There is no single right verbosity. Drafting an MR description wants room to explain. A quick status check wants one line. A static instruction file cannot know which one you are doing right now, so it picks an average and the agent drifts long against it. You can write "be concise" in fifty different ways and still get walls of text on a yes/no question.

Crisp is the knob that dials in the crispness you want for the session, task, or documents.

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

## The same question at different levels

Two more prompts, each shown at level 1, then what level 5 adds on top.

**"What is Claude Code?"**

At level 1:

> Claude Code is Anthropic's agentic coding tool, powered by the Claude models. It runs in a terminal CLI, a Mac/Windows desktop app, the web at claude.ai/code, and VS Code and JetBrains extensions. It reads and edits files, runs shell commands, uses tools, spawns subagents, and supports hooks, slash-command skills, and MCP servers, driving multi-step tasks from plain-language prompts.

At level 5 the same answer keeps that, then adds what it does on a task in more detail, the model family it runs on, and when reaching for an agent beats a single prompt. 58 words at level 1, 259 at level 5.

**"Explain input tokens vs output tokens and how cache reads affect my api bill"**

At level 1:

> Input tokens are everything you send: system prompt, conversation history, tool definitions, and the user's question. Output tokens are what the model generates back. Output costs more per token: Claude Opus 4.8 is $5 per million input and $25 per million output.
>
> Prompt caching matches a prefix. A cache read on that prefix bills at about 0.1x the normal input rate; in the usage object it shows as `cache_read_input_tokens`, while `input_tokens` is the uncached remainder at full price. Writing the cache costs about 1.25x input (5-minute TTL) or 2x (1-hour TTL). Any byte change in the cached prefix invalidates it, and you pay full price again.

At level 5 the same answer keeps that, then adds worked cost math, the prefix-placement rules that keep the cache warm, the silent invalidators to watch for, and how to confirm hits in the `usage` fields.

## Statusline badge (optional)

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

The badge also needs Python 3.

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
