#!/usr/bin/env node
// crisp -- SessionEnd hook. Removes this session's flag files. Best-effort:
// SessionEnd does not fire on hard crashes, so crisp-activate also sweeps stale
// flags on startup.

const { clearLevel, clearPending } = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  try {
    const sid = JSON.parse(input.replace(/^﻿/, '')).session_id || '';
    clearLevel(sid);
    clearPending(sid);
  } catch (e) {}
});
