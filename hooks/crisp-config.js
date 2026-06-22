#!/usr/bin/env node
// crisp -- shared configuration resolver
//
// Default level: CRISP_DEFAULT_LEVEL env var, else '3'.

const path = require('path');
const os = require('os');

const DEFAULT_LEVEL = '3';
const VALID = ['off', '1', '2', '3', '4', '5'];

// Levels are numeric strings ('1'-'5') or 'off'. Trim and lowercase.
function normalizeLevel(level) {
  if (typeof level !== 'string') return null;
  const n = level.trim().toLowerCase();
  return VALID.includes(n) ? n : null;
}

// "stop crisp" / "normal mode" turn it off, but only as a standalone command --
// matching the phrase anywhere would disable it mid-task on an ordinary request
// like "add a normal mode toggle". Require the whole message to be the command.
function isDeactivationCommand(text) {
  const t = String(text || '').trim().toLowerCase().replace(/[.!?\s]+$/, '');
  return t === 'stop crisp' || t === 'normal mode';
}

function getClaudeDir() {
  // CLAUDE_CONFIG_DIR overrides ~/.claude, matching Claude Code itself.
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

function getDefaultLevel() {
  return normalizeLevel(process.env.CRISP_DEFAULT_LEVEL) || DEFAULT_LEVEL;
}

module.exports = {
  DEFAULT_LEVEL,
  normalizeLevel,
  isDeactivationCommand,
  getClaudeDir,
  getDefaultLevel,
};
