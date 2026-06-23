#!/usr/bin/env node
// crisp -- SessionStart hook.
//   1. Writes per-session flag file .crisp-active-<session_id> (statusline reads it)
//   2. Emits the crisp ruleset at the active level as SessionStart context

const { getDefaultLevel } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const { setLevel, clearLevel, writeHookOutput } = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  let sid = '';
  try { sid = JSON.parse(input.replace(/^﻿/, '')).session_id || ''; } catch (e) {}

  // ponytail: orphan flags are 1-byte and harmless (keyed by session id, never
  // read by another session). No cleanup until they visibly pile up.
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
