const fs = require('fs');
const path = require('path');
const { getClaudeDir, normalizeLevel } = require('./crisp-config');

// Per-session flag files so concurrent terminals hold independent levels.
// Falls back to a shared key when a hook gets no session_id (older CLI).
const dir = getClaudeDir();
const SHARED = 'shared';

function safeSid(sessionId) {
  // session_id is a uuid; strip anything not filename-safe just in case.
  const s = String(sessionId || '').replace(/[^A-Za-z0-9_-]/g, '');
  return s || SHARED;
}
function statePath(sid) { return path.join(dir, '.crisp-active-' + safeSid(sid)); }
function pendingPath(sid) { return path.join(dir, '.crisp-pending-' + safeSid(sid)); }

function setLevel(sid, level) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(statePath(sid), level);
}
function clearLevel(sid) { try { fs.unlinkSync(statePath(sid)); } catch (e) {} }

// Active level for this session, or null when off / unset.
function readLevel(sid) {
  try { return normalizeLevel(fs.readFileSync(statePath(sid), 'utf8')); } catch (e) { return null; }
}

// Pending marker: set when the level changes via a blocked command, so the next
// real prompt re-injects the ruleset exactly once instead of every turn.
function setPending(sid) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(pendingPath(sid), '1');
}
function clearPending(sid) { try { fs.unlinkSync(pendingPath(sid)); } catch (e) {} }
function isPending(sid) { return fs.existsSync(pendingPath(sid)); }

// Best-effort sweep of stale per-session flags (orphaned by crashes, since
// SessionEnd is not guaranteed). Removes crisp flag files older than maxAgeMs.
function sweepStale(maxAgeMs, now) {
  try {
    for (const f of fs.readdirSync(dir)) {
      if (!/^\.crisp-(active|pending)-/.test(f)) continue;
      const p = path.join(dir, f);
      try { if (now - fs.statSync(p).mtimeMs > maxAgeMs) fs.unlinkSync(p); } catch (e) {}
    }
  } catch (e) {}
}

// Plain stdout on UserPromptSubmit/SessionStart is injected as additionalContext.
function writeHookOutput(context = '') {
  process.stdout.write(context);
}

// Block the prompt: no model turn, no tokens spent. `reason` is shown to the user.
function writeBlock(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
}

module.exports = {
  statePath, pendingPath, safeSid,
  setLevel, clearLevel, readLevel,
  setPending, clearPending, isPending, sweepStale,
  writeHookOutput, writeBlock,
};
