#!/usr/bin/env bash
# smell-gate: block a push that leaks employer or other internal references.
# Two layers. The grep layer is the hard guarantee (deterministic, offline). The
# claude -p layer is a semantic backstop for paraphrased internal detail that no
# keyword catches; it warns and asks but never silently passes a leak the grep
# layer would have caught.
#
# Usage: scripts/smell-gate.sh [ref ...]   (no args = scan tracked files)
# Exit 0 = clean, 1 = blocked.

set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

# The token list lives OUTSIDE the repo so the repo itself (this script, docs)
# carries no employer words to leak, which means nothing needs exempting and the
# scan covers every tracked file. Default ~/.claude/crisp-smell-patterns.txt
# (override with CRISP_SMELL_PATTERNS). One ERE pattern per line, # comments ok.
# Without the file the gate runs on a harmless stub and warns; the real list is
# intentionally not in version control.
# Base list applies to every repo. A per-repo list (named for this repo's folder,
# e.g. crisp-smell-patterns-crisp.txt) adds repo-specific blocks, so the public
# repo can ban a private sibling's name that the sibling itself uses legitimately.
PATTERN_FILE="${CRISP_SMELL_PATTERNS:-$HOME/.claude/crisp-smell-patterns.txt}"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
REPO_PATTERN_FILE="$(dirname "$PATTERN_FILE")/crisp-smell-patterns-$REPO_NAME.txt"
PATTERN=$(cat "$PATTERN_FILE" "$REPO_PATTERN_FILE" 2>/dev/null \
  | grep -vE '^[[:space:]]*(#|$)' | paste -sd '|' -)
if [ -z "$PATTERN" ]; then
  echo "smell-gate: no pattern file at $PATTERN_FILE; grep layer is a no-op stub." >&2
  PATTERN='__no_internal_pattern_file__'
fi

files=$(git ls-files | grep -vE '^\.git' || true)

hits=$(printf '%s\n' "$files" | xargs /opt/homebrew/bin/ggrep -inE "$PATTERN" 2>/dev/null)
if [ -n "$hits" ]; then
  echo "SMELL GATE: internal references found, push blocked." >&2
  echo "$hits" >&2
  echo "" >&2
  echo "Remove or genericize these before pushing." >&2
  exit 1
fi

# Semantic layer: best-effort. Skipped if claude is unavailable (the grep layer
# already passed, so this only adds coverage, never the sole guarantee).
if command -v claude >/dev/null 2>&1; then
  blob=$(printf '%s\n' "$files" | xargs cat 2>/dev/null | head -c 200000)
  verdict=$(printf '%s' "$blob" | claude -p --model haiku \
    "You are a leak gate for a PUBLIC open-source repo. The text is the full repo content. Flag ONLY material that reveals a specific employer, internal company system, internal hostname, private project codename, or real coworker identity, INCLUDING paraphrased or indirect references that a keyword search would miss (for example describing an internal deployment, an internal ticket system, or a named internal tool without naming it outright). Generic engineering content, public tool names (Claude, Codex, ponytail, caveman), and example code are fine. Reply with exactly CLEAN on the first line if nothing leaks. Otherwise reply BLOCK on the first line, then one line per concern." 2>/dev/null | head -40)
  first=$(printf '%s' "$verdict" | head -1)
  if printf '%s' "$first" | grep -qi '^BLOCK'; then
    echo "" >&2
    echo "SMELL GATE (semantic, ADVISORY): claude flagged possible indirect leakage." >&2
    echo "The push is proceeding (grep layer passed). Review and amend if real:" >&2
    printf '%s\n' "$verdict" >&2
    echo "" >&2
    # Advisory only. A non-deterministic LLM verdict must not hard-block a push:
    # a transient false positive would lock you out. Grep is the hard guarantee.
  elif ! printf '%s' "$first" | grep -qi '^CLEAN'; then
    # API error, empty, or any non-verdict output: layer unavailable, not a flag.
    echo "smell-gate: semantic layer unavailable (grep layer passed)." >&2
  fi
else
  echo "smell-gate: claude not found, ran grep layer only." >&2
fi

echo "smell-gate: clean." >&2
exit 0
