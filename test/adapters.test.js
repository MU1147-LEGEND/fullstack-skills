import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { ClaudeAdapter } from '../src/adapters/claude.js';
import { AntigravityAdapter } from '../src/adapters/antigravity.js';
import { OpenCodeAdapter } from '../src/adapters/opencode.js';
import { VSCodeAdapter } from '../src/adapters/vscode.js';

const mockHome = path.join(os.tmpdir(), 'test-fs-skills-home');
const mockProject = path.join(os.tmpdir(), 'test-fs-skills-proj');
const mockSkillSource = path.join(os.tmpdir(), 'test-fs-skills-src');

test.before(async () => {
  await fs.mkdir(path.join(mockSkillSource, 'test-skill'), { recursive: true });
  await fs.writeFile(
    path.join(mockSkillSource, 'test-skill', 'SKILL.md'),
    '---\nname: test-skill\ndescription: Test skill\n---\n# Test Skill Content',
    'utf8'
  );
  await fs.mkdir(mockHome, { recursive: true });
  await fs.mkdir(mockProject, { recursive: true });
});

test.after(async () => {
  await fs.rm(mockHome, { recursive: true, force: true });
  await fs.rm(mockProject, { recursive: true, force: true });
  await fs.rm(mockSkillSource, { recursive: true, force: true });
});

test('adapters: resolve destinations correctly', () => {
  const claude = new ClaudeAdapter();
  assert.equal(claude.resolveDestination({ scope: 'global', homedir: mockHome }), path.join(mockHome, '.claude', 'skills'));
  assert.equal(claude.resolveDestination({ scope: 'project', projectDir: mockProject }), path.join(mockProject, '.claude', 'skills'));

  const agy = new AntigravityAdapter();
  assert.equal(agy.resolveDestination({ scope: 'global', homedir: mockHome }), path.join(mockHome, '.gemini', 'config', 'skills'));
  assert.equal(agy.resolveDestination({ scope: 'project', projectDir: mockProject }), path.join(mockProject, '.agents', 'skills'));

  const opencode = new OpenCodeAdapter();
  assert.equal(opencode.resolveDestination({ scope: 'project', projectDir: mockProject }), path.join(mockProject, '.opencode', 'skills'));

  const vscode = new VSCodeAdapter();
  assert.equal(vscode.resolveDestination({ scope: 'global', homedir: mockHome }), path.join(mockHome, '.vscode', 'skills'));
  assert.equal(vscode.resolveDestination({ scope: 'project', projectDir: mockProject }), path.join(mockProject, '.vscode', 'skills'));
});

test('adapters: claude installs skill into destination', async () => {
  const claude = new ClaudeAdapter();
  const skills = [{ name: 'test-skill', path: path.join(mockSkillSource, 'test-skill') }];

  const res = await claude.install({
    skills,
    scope: 'project',
    projectDir: mockProject,
    homedir: mockHome,
    force: true
  });

  assert.equal(res.installedCount, 1);
  const skillFile = path.join(mockProject, '.claude', 'skills', 'test-skill', 'SKILL.md');
  const content = await fs.readFile(skillFile, 'utf8');
  assert.match(content, /Test Skill Content/);
});

test('adapters: vscode updates copilot-instructions in project scope', async () => {
  const vscode = new VSCodeAdapter();
  const skills = [{ name: 'test-skill', path: path.join(mockSkillSource, 'test-skill') }];

  const res = await vscode.install({
    skills,
    scope: 'project',
    projectDir: mockProject,
    homedir: mockHome,
    force: true
  });

  assert.equal(res.installedCount, 1);
  const copilotFile = path.join(mockProject, '.github', 'copilot-instructions.md');
  const content = await fs.readFile(copilotFile, 'utf8');
  assert.match(content, /Full-Stack AI Skills Library/);
  assert.match(content, /test-skill/);
});
