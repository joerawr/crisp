#!/usr/bin/env node
// crisp -- shared configuration resolver
//
// Resolution order for default level:
//   1. CRISP_DEFAULT_LEVEL environment variable
//   2. ~/.config/crisp/config.json defaultLevel field
//   3. '3'

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_LEVEL = '3';
const LEVELS = ['1', '2', '3', '4', '5'];
const VALID = ['off', ...LEVELS];

// Levels are numeric strings. Accept a bare number or "off".
function normalizeLevel(level) {
  if (typeof level === 'number') level = String(level);
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

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) return path.join(process.env.XDG_CONFIG_HOME, 'crisp');
  return path.join(os.homedir(), '.config', 'crisp');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getClaudeDir() {
  // CLAUDE_CONFIG_DIR overrides ~/.claude, matching Claude Code itself.
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

function getDefaultLevel() {
  const env = normalizeLevel(process.env.CRISP_DEFAULT_LEVEL);
  if (env) return env;
  try {
    const cfg = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
    const lvl = normalizeLevel(cfg.defaultLevel);
    if (lvl) return lvl;
  } catch (e) {
    // no/invalid config -- fall through
  }
  return DEFAULT_LEVEL;
}

module.exports = {
  DEFAULT_LEVEL,
  LEVELS,
  VALID,
  normalizeLevel,
  isDeactivationCommand,
  getConfigDir,
  getConfigPath,
  getClaudeDir,
  getDefaultLevel,
};
