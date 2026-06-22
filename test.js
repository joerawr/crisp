#!/usr/bin/env node
// crisp self-check. Run: node test.js  (exits non-zero on failure)
const assert = require('assert');
const { normalizeLevel, isDeactivationCommand, getDefaultLevel } = require('./hooks/crisp-config');
const { getCrispInstructions } = require('./hooks/crisp-instructions');

// normalizeLevel: accepts 1-5 and off, rejects junk, tolerates whitespace/number
assert.strictEqual(normalizeLevel('3'), '3');
assert.strictEqual(normalizeLevel(2), '2');
assert.strictEqual(normalizeLevel(' 5 '), '5');
assert.strictEqual(normalizeLevel('OFF'), 'off');
assert.strictEqual(normalizeLevel('6'), null);
assert.strictEqual(normalizeLevel('full'), null);
assert.strictEqual(normalizeLevel(''), null);

// Deactivation: only a standalone command, not a substring (the bug ponytail hit)
assert.strictEqual(isDeactivationCommand('stop crisp'), true);
assert.strictEqual(isDeactivationCommand('Normal Mode.'), true);
assert.strictEqual(isDeactivationCommand('add a normal mode toggle'), false);
assert.strictEqual(isDeactivationCommand('stop crisp from being so terse please'), false);

// Default level is 3 unless env/config override (env not set in this process)
delete process.env.CRISP_DEFAULT_LEVEL;
assert.strictEqual(getDefaultLevel(), '3');

// Instructions actually load the skill body and stamp the active level
const out = getCrispInstructions('2');
assert.ok(out.includes('CRISP ACTIVE -- level: 2'), 'banner missing level');
assert.ok(out.includes('Humanizer floor'), 'skill body not inlined');
assert.ok(!out.includes('\u2014'), 'instructions contain an em dash');

console.log('crisp: all checks passed');
