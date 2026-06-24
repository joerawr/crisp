# CLAUDE.md, crisp

Crisp is a verbosity dial for Claude Code: a SessionStart hook injects a ruleset
at level 1-5, a UserPromptSubmit hook handles `/crisp n` (blocks the prompt, zero
tokens), a statusline shows `[CRISP:n]`. Pure Node hooks, zero npm deps.

## This repo is PUBLIC

Treat everything here as shippable to the open internet. Never introduce employer
names, internal hostnames, project codenames, internal tooling, or real coworker
identities, including paraphrased forms, and do not reference private repositories
or local machine paths. `README_CRISP_OFF.md` intentionally contains AI-tell prose
(em dashes, emoji) as a demo; that is the one allowed style exception, and it must
still carry zero internal references.

## Before pushing

A `pre-push` smell gate runs automatically (`core.hooksPath .githooks`, installed
via `scripts/install-hooks.sh`). Two layers: a grep layer that hard-blocks
sensitive tokens (the token list lives outside the repo), and a `claude -p`
advisory layer for paraphrased leaks. After a fresh clone, run
`bash scripts/install-hooks.sh` once. Do not bypass with `--no-verify`.

## Workflow

Solo author cadence: committing to `main` is fine, the smell gate is the guard,
not PR ceremony. Commit messages carry no AI attribution (authored as a human).

## Verify

`node test.js` (self-check: level parsing, the block/pending switch, per-session
isolation).
