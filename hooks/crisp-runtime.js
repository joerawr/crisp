const fs = require('fs');
const path = require('path');
const { getClaudeDir } = require('./crisp-config');

const STATE_FILE = '.crisp-active';
const statePath = path.join(getClaudeDir(), STATE_FILE);

function setLevel(level) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, level);
}

function clearLevel() {
  try { fs.unlinkSync(statePath); } catch (e) {}
}

// Claude Code reads SessionStart/UserPromptSubmit additionalContext from stdout.
function writeHookOutput(context = '') {
  process.stdout.write(context);
}

module.exports = { statePath, setLevel, clearLevel, writeHookOutput };
