# Crisp, with the dial OFF

> Demo: this is what a capable default agent produces when you ask it to "write
> a really good README" with no Crisp dial and no humanizer floor. It is
> accurate and, by conventional standards, well written. It is also soaked in
> the tells Crisp exists to remove: em dashes, the rule of three, emoji
> headers, "powerful / robust / seamless / crucial", bold inline-list headers,
> a "Let's dive in", and a cheerleader closing. Read it next to
> `README_CRISP_4.md` (the same content, dial on) to see the difference. Nothing
> below is edited. This is the before picture on purpose.

---

# Crisp

> A verbosity dial for Claude Code. One number, 1 to 5, sets how much your agent writes — and nothing more.

## ✨ Overview

Have you ever felt that your AI coding agent talks *too much*? Pages of reasoning when you wanted a one-liner. A pull request description that reads like a dissertation. Code comments that narrate every obvious step? **Crisp** is here to fix exactly that.

Crisp is a powerful, lightweight plugin for [Claude Code](https://claude.com/claude-code) that gives you a single, intuitive control — a verbosity dial — to tune how much your agent writes across three surfaces at once: **session prose**, **merge request descriptions**, and **code comments**. You set one number from 1 to 5, and Crisp does the rest. Lower means more concise. Higher means more thorough. The default is a balanced **3**.

The best part? Crisp never sacrifices clarity for brevity. Even at its tightest setting, it keeps clean, grammatical, human English. This is *not* a "caveman" mode that mangles your sentences into broken fragments — it is leveled concision that respects the reader at every step. Let's dive in.

## 🎯 Why Crisp?

Modern AI assistants are, by default, *verbose*. They hedge, they signpost, they restate the question before answering it, and they pad every response with the kind of throat-clearing that buries the actual signal. That tendency is fine sometimes — but often it is just noise, and noise has a cost: your time, your attention, and the readability of your codebase and your code review history.

Crisp gives you back control with three core promises:

- **One dial, total reach.** A single number governs prose, MR descriptions, *and* code comments. No juggling separate settings, no per-surface configuration — just one source of truth.
- **Concise, never broken.** Every level produces polished, professional, human-readable English. Brevity is the goal; clarity is non-negotiable.
- **Safety that never compresses.** Crucial warnings always survive, no matter how low you turn the dial. (More on this powerful guarantee below.)

## 🎚️ The Dial: From Full Reasoning to Answer-Only

At the heart of Crisp is the dial itself — five carefully calibrated levels, each with a soft target for how much the agent writes. Think of these as *targets*, not hard caps; the agent flexes intelligently around them based on what the moment genuinely requires.

| Level | Style | Soft Target (session prose) |
|:-----:|-------|:---------------------------:|
| **5** | Full reasoning — the agent thinks out loud, step by step | ~40 lines |
| **4** | Trimmed — hedges and filler removed, reasoning intact | ~16 lines |
| **3** | Answer-first — lead with the conclusion, then justify *(default)* | ~9 lines |
| **2** | Answer plus one line of *why* | ~4 lines |
| **1** | Answer-only — the essential result, nothing more | ~2 lines |

And here is the truly elegant part: **code comments scale on the very same dial.** Turn the verbosity down, and your inline commentary tightens right alongside your prose. Turn it up, and the agent will walk a future reader through the reasoning. One number, consistent behavior everywhere — it is a genuinely seamless experience.

## 🛡️ Two Always-On Layers

Beyond the dial, Crisp runs two robust layers that are *always* active, regardless of which level you have selected. These are the guardrails that make aggressive concision safe to use in a real engineering workflow.

### The Humanizer Floor

No matter how high or low you set the dial, Crisp applies a **humanizer floor** that strips out the tell-tale fingerprints of AI-generated writing. The result reads like it came from a thoughtful human engineer — not a language model on autopilot. This floor is foundational; it is always on.

### The Safety Carve-Out

This is arguably the most crucial feature in the entire plugin. Crisp will **never** compress:

- 🔒 **Security warnings**
- ⚠️ **Correctness caveats**
- 🚧 **Risk and blocker flags**

Even at **level 1** — the most aggressive, answer-only setting — these critical signals pass through untouched. You can crank the dial all the way down with total confidence, knowing that the things which *must* be said will always be said. Concision should never cost you safety, and with Crisp, it never does.

## 🚀 Installation

Getting started with Crisp is quick and painless. You will need **Node** available on your `PATH`, and then it is just two commands inside Claude Code:

```
/plugin marketplace add joerawr/crisp
/plugin install crisp@crisp
```

That's it — you are ready to dial in your perfect verbosity.

## 🕹️ Usage

Crisp is designed to feel effortless from the very first command. Setting your verbosity level is as simple as:

```
/crisp 3
```

Swap in any number from **1** to **5** to taste. Want to switch Crisp off entirely and return to your agent's default behavior? Any of these will do it:

```
/crisp off
```

You can also just say **"stop crisp"** or **"normal mode"** in plain language — Crisp understands all three.

### Setting Your Default

Prefer to start every session at a particular level? Crisp makes that effortless too. You have two convenient options:

- **Environment variable:** set `CRISP_DEFAULT_LEVEL` to your preferred number.
- **Config file:** drop your preference into `~/.config/crisp/config.json`.

Either way, your sessions will open right where you like them.

### The Statusline Badge

So you always know exactly where the dial is set, Crisp surfaces a clean little badge in your statusline:

```
[CRISP:3]
```

The `n` updates live as you adjust the level — a small touch, but a genuinely helpful one for staying oriented at a glance.

## ⚙️ How It Works

For the curious — and for the engineers who like to understand the machinery before they trust it — here is a look under the hood. Crisp is built on a clean, hook-driven architecture that integrates smoothly with Claude Code's lifecycle:

1. **A `SessionStart` hook** injects the appropriate ruleset for your active level and writes a flag file to track state across the session.
2. **A `UserPromptSubmit` hook** watches for your `/crisp` commands and updates the level on the fly, so changes take effect immediately.
3. **A statusline script** renders that `[CRISP:n]` badge — and, thoughtfully, it can *chain onto an existing statusline* rather than clobbering whatever you already have configured.

It is a lightweight, transparent design that does exactly what it says and nothing it shouldn't.

## 💡 Inspiration

Crisp did not emerge from a vacuum. It proudly stands on the shoulders of three excellent projects, each of which contributed a key idea:

- **[ponytail](https://github.com/DietrichGebert/ponytail)** — for the elegant hook architecture that makes Crisp tick.
- **[caveman](https://github.com/JuliusBrussee/caveman)** — for the concept of leveled brevity (though Crisp keeps the grammar intact!).
- **[humanizer](https://github.com/blader/humanizer)** — for the AI-writing floor that keeps every output sounding genuinely human.

A heartfelt thank-you to the creators of all three. Crisp is, in many ways, a love letter to the ideas they pioneered.

## 🎉 Wrapping Up

Crisp exists for one simple reason: **your agent should say exactly as much as you need — and not a word more.** With a single, intuitive dial, two always-on safety layers, and a clean hook-based design, it delivers concision you can actually trust in a real engineering workflow.

So go ahead — install it, dial it in, and reclaim your signal from the noise. We think you are going to love it. Happy (and concise) coding! 🚀
