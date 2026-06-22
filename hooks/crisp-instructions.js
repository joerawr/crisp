#!/usr/bin/env node
// crisp -- builds the ruleset injected at session start / level change.
// Injects the whole SKILL body (the dial table's taper is the point -- the
// model needs to see neighboring levels to calibrate), banner-marked with the
// active level.

const fs = require('fs');
const path = require('path');
const { DEFAULT_LEVEL } = require('./crisp-config');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'crisp', 'SKILL.md');

function getCrispInstructions(level) {
  const lvl = level || DEFAULT_LEVEL;
  const banner = 'CRISP ACTIVE -- level: ' + lvl +
    ' (of 1-5; lower = say less). Follow the dial below at level ' + lvl +
    '. The humanizer floor and safety carve-out apply at every level.';
  try {
    const body = fs.readFileSync(SKILL_PATH, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
    return banner + '\n\n' + body;
  } catch (e) {
    // SKILL.md ships in the same plugin dir as this hook, so an unreadable file
    // is effectively impossible. Banner alone still tells the model the level.
    return banner;
  }
}

module.exports = { getCrispInstructions };
