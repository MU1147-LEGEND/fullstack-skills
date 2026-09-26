import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

import { listSkills, installSkills } from '../src/installer.js';
import { compactor } from '../src/compactor.js';

test('installer: listSkills returns all 20 skills', async () => {
  const skills = await listSkills();
  assert.equal(skills.length, 20);

  const backend = skills.filter((s) => s.category === 'backend');
  const frontend = skills.filter((s) => s.category === 'frontend');

  assert.equal(backend.length, 9);
  assert.equal(frontend.length, 11);

  // Check known skill presence
  assert.ok(backend.some((s) => s.name === 'use-backend'));
  assert.ok(backend.some((s) => s.name === 'security'));
  assert.ok(frontend.some((s) => s.name === 'using-frontend'));
  assert.ok(frontend.some((s) => s.name === 'accessibility'));
});

test('installer: installs bundle subset correctly', async () => {
  const tempProject = path.join(os.tmpdir(), 'test-install-bundle');
  await fs.mkdir(tempProject, { recursive: true });

  const res = await installSkills({
    editor: 'claude-code',
    scope: 'project',
    bundle: 'frontend',
    projectDir: tempProject,
    force: true,
  });

  assert.equal(res.selectedSkillsCount, 11);
  assert.equal(res.results.length, 1);
  assert.equal(res.results[0].installedCount, 11);

  // Clean up
  await fs.rm(tempProject, { recursive: true, force: true });
});

test('compactor: gzip roundtrip test', () => {
  const text = 'Hello Full-Stack Skills!'.repeat(100);
  const compressed = compactor.compress(text);
  assert.ok(compressed.length < Buffer.byteLength(text));
  const decompressed = compactor.decompress(compressed);
  assert.equal(decompressed, text);
});
