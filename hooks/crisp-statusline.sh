#!/usr/bin/env bash
# crisp statusline. Appends the [CRISP:n] badge for THIS session, read from the
# per-session flag file. Claude Code allows only one statusLine command, so if
# you already run a statusline tool, chain it: set CRISP_INNER_STATUSLINE to its
# command and this script forwards the session JSON to it first, then appends.
#
# Examples:
#   CRISP_INNER_STATUSLINE='ccusage statusline'
#   CRISP_INNER_STATUSLINE='my-statusline --flag'
# Leave it unset to show only the crisp badge.

input="$(cat)"

inner="${CRISP_INNER_STATUSLINE:-}"
if [ -n "$inner" ]; then
  printf '%s' "$input" | eval "$inner"
fi

# Per-session flag: read this session's id from the statusline JSON and look up
# .crisp-active-<id>. Falls back to the shared flag if no session_id is present.
dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
sid=$(printf '%s' "$input" | python3 -c 'import sys,json,re
try: s=json.load(sys.stdin).get("session_id","") or ""
except Exception: s=""
sys.stdout.write(re.sub(r"[^A-Za-z0-9_-]","",s))' 2>/dev/null)

flag="$dir/.crisp-active-${sid:-shared}"
[ -f "$flag" ] || exit 0
level=$(head -n1 "$flag" | tr -d '[:space:]')
[ -n "$level" ] || exit 0

printf ' \033[38;5;75m[CRISP:%s]\033[0m' "$level"
