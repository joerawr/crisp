#!/usr/bin/env node
// crisp self-check. Run: node test.js  (exits non-zero on failure)
// Uses a temp CLAUDE_CONFIG_DIR so the live ~/.claude/.crisp-active flag is never touched.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'crisp-test-'));
process.env.CLAUDE_CONFIG_DIR = TMP;
delete process.env.CRISP_DEFAULT_LEVEL;

const { normalizeLevel, isDeactivationCommand, getDefaultLevel } = require('./hooks/crisp-config');
const { getCrispInstructions } = require('./hooks/crisp-instructions');

// --- config ---
assert.strictEqual(normalizeLevel('3'), '3');
assert.strictEqual(normalizeLevel(2), '2');
assert.strictEqual(normalizeLevel(' 5 '), '5');
assert.strictEqual(normalizeLevel('OFF'), 'off');
assert.strictEqual(normalizeLevel('6'), null);
assert.strictEqual(normalizeLevel('full'), null);
assert.strictEqual(normalizeLevel(''), null);

assert.strictEqual(isDeactivationCommand('stop crisp'), true);
assert.strictEqual(isDeactivationCommand('Normal Mode.'), true);
assert.strictEqual(isDeactivationCommand('add a normal mode toggle'), false);

assert.strictEqual(getDefaultLevel(), '3');

// --- instructions ---
const out = getCrispInstructions('2');
assert.ok(out.includes('CRISP ACTIVE -- level: 2'), 'banner missing level');
assert.ok(out.includes('Humanizer floor'), 'skill body not inlined');
assert.ok(!out.includes('\u2014'), 'instructions contain an em dash');
assert.ok(out.includes('process narration'), 'process-narration rule missing');

// --- tracker hook: /crisp n blocks (instant, zero-token) and arms pending ---
function runTracker(prompt) {
  const res = execFileSync('node', [path.join(__dirname, 'hooks', 'crisp-tracker.js')], {
    input: JSON.stringify({ prompt }),
    env: { ...process.env, CLAUDE_CONFIG_DIR: TMP },
    encoding: 'utf8',
  });
  return res;
}
const flag = path.join(TMP, '.crisp-active');
const pend = path.join(TMP, '.crisp-pending');

let r = runTracker('/crisp 2');
let j = JSON.parse(r);
assert.strictEqual(j.decision, 'block', '/crisp n must block the prompt (no model turn)');
assert.ok(/level 2/.test(j.reason), 'block reason should name the level');
assert.strictEqual(fs.readFileSync(flag, 'utf8'), '2', 'flag should be 2');
assert.ok(fs.existsSync(pend), 'switch should arm pending');

// next real prompt: re-inject once, then clear pending
let r2 = runTracker('do the thing');
assert.ok(r2.includes('CRISP ACTIVE -- level: 2'), 'pending prompt should re-inject ruleset');
assert.ok(!fs.existsSync(pend), 'pending cleared after one re-inject');

// following real prompt: no injection (steady state, zero tokens)
let r3 = runTracker('another prompt');
assert.strictEqual(r3.trim(), '', 'steady-state prompt should inject nothing');

// off blocks and clears the flag
let r4 = JSON.parse(runTracker('/crisp off'));
assert.strictEqual(r4.decision, 'block', 'off must block');
assert.ok(!fs.existsSync(flag), 'off should clear the flag');

fs.rmSync(TMP, { recursive: true, force: true });
console.log('crisp: all checks passed');
