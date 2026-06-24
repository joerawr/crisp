#!/usr/bin/env bash
# One-liner to wire the repo's versioned hooks. Run once after cloning:
#   bash scripts/install-hooks.sh
set -e
cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
chmod +x .githooks/* scripts/*.sh 2>/dev/null || true
echo "hooks installed: core.hooksPath -> .githooks (pre-push smell gate active)"
