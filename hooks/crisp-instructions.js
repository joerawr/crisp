#!/usr/bin/env node
// crisp -- builds the ruleset injected at session start / level change.
// Injects the whole SKILL body (the dial table's taper is the point -- the
// model needs to see neighboring levels to calibrate), banner-marked with the
// active level.

const fs = require('fs');
const path = require('path');
const { DEFAULT_LEVEL } = require('./crisp-config');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'crisp', 'SKILL.md');

function getFallbackInstructions(level) {
  return 'CRISP ACTIVE -- level: ' + level + ' (of 1-5; lower = terser, clean human English, not caveman)\n\n' +
    'Lead with the answer. Surface only the load-bearing reasoning the level allows.\n' +
    'L5 ~40 lines full reasoning. L4 ~16, hedges cut. L3 ~9, reasoning only where it changes the decision. ' +
    'L2 ~4, answer plus one why. L1 ~2, answer only.\n' +
    'Code comments scale the same way: L5 explain non-obvious why, down to L1 rare and surgical.\n\n' +
    'Humanizer floor, every level: no em/en dashes, no rule of three, no AI-vocab clusters ' +
    '(delve, leverage, crucial, robust, seamless, underscore, tapestry), no signposting, no sycophancy, ' +
    'no negative parallelism or tailing-negation fragments. Vary rhythm. Concrete over abstract. Write clean first time.\n\n' +
    'Safety carve-out overrides the dial at every level: never compress security warnings, mandated inline ' +
    'edge-case/SECURITY-REVIEW comments, correctness caveats, or risk/blocker/assumption flags. Correctness outranks concision.\n\n' +
    'Govern prose and comments, not architecture. Follow silently; do not narrate the level.';
}

function getCrispInstructions(level) {
  const lvl = level || DEFAULT_LEVEL;
  const banner = 'CRISP ACTIVE -- level: ' + lvl +
    ' (of 1-5; lower = say less). Follow the dial below at level ' + lvl +
    '. The humanizer floor and safety carve-out apply at every level.';
  try {
    const body = fs.readFileSync(SKILL_PATH, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
    return banner + '\n\n' + body;
  } catch (e) {
    return getFallbackInstructions(lvl);
  }
}

module.exports = { getFallbackInstructions, getCrispInstructions };
