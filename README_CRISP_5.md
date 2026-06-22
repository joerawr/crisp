# Crisp, explained at level 5

> Demo: this is the project explained as a level-5 (full reasoning) response
> would read. Compare it against `README_CRISP_1.md` through `_4.md` to see the
> taper. The real README is `README.md` (level 4).

Crisp is a verbosity dial for Claude Code. It exists because the default agent,
even with a careful CLAUDE.md asking for concision, tends to drift long: it
restates points, hedges, pads code comments to eight lines where two would do,
and reaches for the same inflated vocabulary. A static instruction file cannot
fix this reliably, because there is no single right verbosity. An architecture
review wants full reasoning; a quick command lookup wants one line. What is
missing is a knob you can turn per session.

So Crisp is that knob: one number, 1 to 5, that sets how much the agent writes
across three surfaces at once, session prose, merge request descriptions, and
code comments. Lower says less. The default is 3, which leads with the answer
and surfaces reasoning only where it changes a decision.

The design separates two things that are usually tangled. The first is length,
which the dial controls. The second is voice, which an always-on humanizer
floor controls independently, so that even a long level-5 answer still avoids
the tells of AI writing. The floor bans em and en dashes, the rule of three,
AI-vocab clusters like "delve" and "leverage" and "robust", signposting such as
"let's dive in", sycophantic openers, and negative parallelism. It asks for
varied sentence rhythm and concrete detail. Unlike a cleanup skill, it runs in
the first pass with no separate audit step, because added latency would defeat
the point of an always-on tool.

Sitting above both layers is a safety carve-out that overrides the dial at
every level, including 1. Length is never allowed to compress away a security
warning, a mandated inline edge-case comment, a correctness caveat, or a risk
or blocker flag on a plan. If a low level would force one of those to be cut,
the response runs longer instead. Correctness outranks concision.

Crisp deliberately is not caveman. Caveman proved that brevity can be a
switchable, leveled mode, but it pays for compression with broken grammar and a
cave-dweller persona, which trades real communication for a joke. Crisp keeps
the leveled brevity and stays in clean, articulate English.

Mechanically, it borrows ponytail's proven shape. A SessionStart hook writes a
flag file and injects the ruleset at the active level. A UserPromptSubmit hook
watches for `/crisp n`, updates the flag, and re-injects so the change takes
effect the same turn. A statusline script appends a `[CRISP:n]` badge and can
chain onto an existing statusline through the `CRISP_INNER_STATUSLINE` variable.
The default level can be set with the `CRISP_DEFAULT_LEVEL` environment variable
or a small JSON config file.

## Inspirations

- [ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich Gebert,
  for the hook architecture and the build-time discipline Crisp pairs with.
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee, for
  the idea of brevity as a leveled, switchable mode.
- [humanizer](https://github.com/blader/humanizer), based on Wikipedia's "Signs
  of AI writing" guide, for the humanizer floor.
