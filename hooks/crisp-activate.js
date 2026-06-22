#!/usr/bin/env node
// crisp -- SessionStart hook.
//   1. Writes per-session flag file .crisp-active-<session_id> (statusline reads it)
//   2. Emits the crisp ruleset at the active level as SessionStart context
//   3. Sweeps stale flag files left by crashed sessions (SessionEnd is best-effort)

const { getDefaultLevel } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const { setLevel, clearLevel, sweepStale, writeHookOutput } = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  let sid = '';
  try { sid = JSON.parse(input.replace(/^﻿/, '')).session_id || ''; } catch (e) {}

  // Sweep flags older than 24h. Orphans only; a live session rewrites its flag
  // every turn so its mtime stays fresh.
  sweepStale(24 * 60 * 60 * 1000, Date.now());

  const level = getDefaultLevel();
  if (level === 'off') {
    clearLevel(sid);
    process.exit(0);
  }
  try { setLevel(sid, level); } catch (e) { /* flag is best-effort */ }
  try {
    writeHookOutput(getCrispInstructions(level));
  } catch (e) {
    // EPIPE / closed stdout at hook exit must not surface as a hook failure
  }
});
