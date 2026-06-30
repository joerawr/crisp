#!/usr/bin/env node
// crisp -- SessionStart hook.
//   1. Writes per-session flag file .crisp-active-<session_id> (statusline reads it)
//   2. Emits the crisp ruleset at the active level as SessionStart context

const { getDefaultLevel } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const { setLevel, clearLevel, readLevel, writeHookOutput } = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  let sid = '', source = 'startup';
  try {
    const data = JSON.parse(input.replace(/^﻿/, ''));
    sid = data.session_id || '';
    source = data.source || 'startup';
  } catch (e) {}

  // ponytail: orphan flags are 1-byte and harmless (keyed by session id, never
  // read by another session). No cleanup until they visibly pile up.

  // compact and resume must not clobber a level the user set mid-session, nor
  // resurrect crisp after "off". Respect the on-disk flag: present -> keep it
  // and reinject, absent -> the user is off, so stay quiet. Only a true fresh
  // start (startup/clear) resets to the configured default.
  if (source === 'compact' || source === 'resume') {
    const existing = readLevel(sid);
    if (!existing) process.exit(0); // off (or default-off): do not re-enable
    try {
      writeHookOutput(getCrispInstructions(existing));
    } catch (e) { /* EPIPE on hook exit is not a failure */ }
    process.exit(0);
  }

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
