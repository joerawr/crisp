#!/usr/bin/env bash
# crisp statusline. Appends the [CRISP:n] badge read from the flag file.
# Claude Code allows only one statusLine command, so if you already run a
# statusline tool, chain it: set CRISP_INNER_STATUSLINE to its command and this
# script forwards the session JSON to it first, then appends the badge.
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

flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.crisp-active"
[ -f "$flag" ] || exit 0
level=$(head -n1 "$flag" | tr -d '[:space:]')
[ -n "$level" ] || exit 0

printf ' \033[38;5;75m[CRISP:%s]\033[0m' "$level"
