#!/usr/bin/env node
// crisp -- UserPromptSubmit hook. Watches for /crisp <n> and the deactivation
// command, updates the flag file, and confirms the change back to the model.

const { getDefaultLevel, normalizeLevel, isDeactivationCommand } = require('./crisp-config');
const { getCrispInstructions } = require('./crisp-instructions');
const { setLevel, clearLevel, writeHookOutput } = require('./crisp-runtime');

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^﻿/, ''));
    const prompt = (data.prompt || '').trim();

    if (/^[/@]crisp\b/i.test(prompt)) {
      const arg = prompt.split(/\s+/)[1] || '';
      const level = normalizeLevel(arg) || getDefaultLevel(); // bare /crisp -> default

      if (level === 'off') {
        clearLevel();
        writeHookOutput('CRISP OFF -- normal verbosity restored.');
      } else {
        setLevel(level);
        // Re-inject the ruleset at the new level so the change takes effect this turn.
        writeHookOutput('CRISP LEVEL CHANGED -- now level ' + level + '.\n\n' + getCrispInstructions(level));
      }
      return;
    }

    if (isDeactivationCommand(prompt)) {
      clearLevel();
      writeHookOutput('CRISP OFF -- normal verbosity restored.');
    }
  } catch (e) {
    // Silent fail -- never block a prompt over level tracking
  }
});
