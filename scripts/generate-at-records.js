const fs = require('fs');
const path = require('path');

const axeData = JSON.parse(fs.readFileSync('artifacts/axe-results.json', 'utf8'));
const evidence = JSON.parse(fs.readFileSync('artifacts/a11y-evidence.json', 'utf8'));
const keyboard = fs.readFileSync('docs/keyboard-audit-results.md', 'utf8');

const kbRows = {};
const lines = keyboard.split('\n');
for (const line of lines) {
  const parts = line.split('|').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 7) {
    const primitive = parts[0].toLowerCase();
    const focus = parts[1];
    const status = parts[6];
    if (status === 'Pass' || status === 'Fail') {
      kbRows[primitive] = { hasFocus: focus, status };
    }
  }
}

const outDir = 'docs/at-audit-results';
let count = 0;

for (const result of axeData.results) {
  const name = result.primitive;
  const ev = evidence.primitives[name] || {};
  const kb = kbRows[name];
  const evId = ev.evidenceIds ? ev.evidenceIds[0] : 'N/A';
  const lastRun = ev.lastRun || axeData.generatedAt;

  const s = result.evidence.summary;
  const title = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

  const content = [
    '---',
    'id: at-' + name,
    'title: "AT Verification Record - ' + title + '"',
    'doc_type: reference',
    'audience: "Solidiom contributors, accessibility reviewers"',
    'tags: [accessibility, AT, verification, ' + name + ']',
    'lifecycle: current',
    '---',
    '',
    '# AT Verification Record: ' + title,
    '',
    '## Summary',
    '',
    '| Field | Value |',
    '| ----- | ----- |',
    '| Evidence ID | ' + evId + ' |',
    '| Outcome | ' + s.outcome + ' |',
    '| Passes | ' + s.passes + ' |',
    '| Violations | ' + s.violations + ' |',
    '| Incomplete | ' + s.incomplete + ' |',
    '| Last Run | ' + lastRun + ' |',
    '| Keyboard Interactive | ' + (kb ? kb.hasFocus : 'N/A') + ' |',
    '| Keyboard Status | ' + (kb ? kb.status : 'N/A') + ' |',
    '',
    '## Automated Evidence',
    '',
    'Source: axe-core isolated scan (' + result.evidence.kind + ').',
    '',
    '-' + s.passes + ' rule(s) passed',
    '-' + s.violations + ' violation(s) found',
    '-' + s.incomplete + ' incomplete result(s)',
    '',
    '## Manual Verification Status',
    '',
    '| Dimension | Status |',
    '| --------- | ------ |',
    '| Keyboard | ' + (kb && kb.status === 'Pass' ? 'Verified (keyboard-audit-results.md)' : 'N/A') + ' |',
    '| Focus | ' + (kb && kb.hasFocus && kb.hasFocus !== 'N/A' ? 'Verified' : 'N/A') + ' |',
    '| Zoom | — |',
    '| Contrast | — |',
    '| Reduced motion | — |',
    '| Screen readers (VoiceOver) | — |',
    '| Touch | — |',
    '',
    '## Notes',
    '',
    'Generated from axe scan artifact ' + axeData.generatedAt + '. Manual dimensions marked with — are tracked as Phase 4 work per A11Y-005.',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(outDir, name + '.md'), content);
  count++;
}

console.log('Generated ' + count + ' per-primitive AT records');