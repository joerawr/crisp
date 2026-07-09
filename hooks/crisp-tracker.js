#!/usr/bin/env node
// crisp -- UserPromptSubmit hook.
//
// On `/crisp <n>` (or off / "stop crisp" / "normal mode"): update the flag and
// BLOCK the prompt. Blocking means no model turn and zero tokens -- the switch
// is instant. A pending marker is set so the next real prompt re-injects the
// ruleset once, which is how a mid-session change takes effect without paying a
// full inference turn per switch.
//
// On any other prompt: if a switch is pending, inject the ruleset once and clear
// the marker. Otherwise do nothing (the SessionStart injection still stands).

const { getDefaultLevel, normalizeLevel, isDeactivationCommand } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const {
  setLevel, clearLevel, readLevel, setPending, clearPending, isPending,
  writeHookOutput, writeBlock,
} = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^﻿/, ''));
    const sid = data.session_id || '';
    const prompt = (data.prompt || '').trim();

    // /crisp <n> or bare /crisp
    if (/^[/@]crisp\b/i.test(prompt)) {
      const arg = prompt.split(/\s+/)[1] || '';
      const level = normalizeLevel(arg) || getDefaultLevel(); // bare /crisp -> default
      if (level === 'off') {
        clearLevel(sid);
        clearPending(sid);
        writeBlock('Crisp off. Normal verbosity restored. ("Blocked by hook" is expected: the switch is handled by the hook, no tokens spent.)');
      } else {
        setLevel(sid, level);
        setPending(sid); // next real prompt re-injects at the new level
        writeBlock('Crisp set to level ' + level + '. Applies from your next message. ("Blocked by hook" is expected: the switch is handled by the hook, no tokens spent.)');
      }
      return;
    }

    // "stop crisp" / "normal mode" as a standalone command
    if (isDeactivationCommand(prompt)) {
      clearLevel(sid);
      clearPending(sid);
      writeBlock('Crisp off. Normal verbosity restored. ("Blocked by hook" is expected: the switch is handled by the hook, no tokens spent.)');
      return;
    }

    // Ordinary prompt: re-inject once if a switch is pending, then clear it.
    if (isPending(sid)) {
      clearPending(sid);
      const level = readLevel(sid);
      if (level) writeHookOutput(getCrispInstructions(level));
    }
  } catch (e) {
    // Silent fail -- never block an ordinary prompt over level tracking
  }
});
