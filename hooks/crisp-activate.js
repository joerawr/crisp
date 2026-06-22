#!/usr/bin/env node
// crisp -- SessionStart hook.
//   1. Writes flag file at $CLAUDE_CONFIG_DIR/.crisp-active (statusline reads it)
//   2. Emits the crisp ruleset at the active level as SessionStart context

const { getDefaultLevel } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const { setLevel, clearLevel, writeHookOutput } = require('./crisp-runtime');

const level = getDefaultLevel();

if (level === 'off') {
  clearLevel();
  process.exit(0);
}

try { setLevel(level); } catch (e) { /* flag is best-effort */ }

try {
  writeHookOutput(getCrispInstructions(level));
} catch (e) {
  // EPIPE / closed stdout at hook exit must not surface as a hook failure
}
