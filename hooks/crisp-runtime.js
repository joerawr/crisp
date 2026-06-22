const fs = require('fs');
const path = require('path');
const { getClaudeDir, normalizeLevel } = require('./crisp-config');

const STATE_FILE = '.crisp-active';
const PENDING_FILE = '.crisp-pending';
const statePath = path.join(getClaudeDir(), STATE_FILE);
const pendingPath = path.join(getClaudeDir(), PENDING_FILE);

function setLevel(level) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, level);
}

function clearLevel() {
  try { fs.unlinkSync(statePath); } catch (e) {}
}

// Active level from the flag file, or null when off / unset.
function readLevel() {
  try { return normalizeLevel(fs.readFileSync(statePath, 'utf8')); } catch (e) { return null; }
}

// Pending marker: set when the level changes via a blocked command, so the next
// real prompt re-injects the ruleset exactly once instead of every turn.
function setPending() {
  fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
  fs.writeFileSync(pendingPath, '1');
}
function clearPending() { try { fs.unlinkSync(pendingPath); } catch (e) {} }
function isPending() { return fs.existsSync(pendingPath); }

// Plain stdout on UserPromptSubmit/SessionStart is injected as additionalContext.
function writeHookOutput(context = '') {
  process.stdout.write(context);
}

// Block the prompt: no model turn, no tokens spent. `reason` is shown to the user.
function writeBlock(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
}

module.exports = {
  setLevel, clearLevel, readLevel,
  setPending, clearPending, isPending,
  writeHookOutput, writeBlock,
};
