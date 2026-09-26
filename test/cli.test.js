import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

const execFileAsync = promisify(execFile);
const CLI_PATH = path.resolve('bin/cli.js');

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

test('cli: prints help with --help', async () => {
  const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, '--help']);
  const clean = stripAnsi(stdout);
  assert.match(clean, /fullstack-skills/);
  assert.match(clean, /USAGE:/);
  assert.match(clean, /OPTIONS:/);
});

test('cli: prints version with --version', async () => {
  const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, '--version']);
  const clean = stripAnsi(stdout);
  assert.match(clean, /fullstack-skills v1\.\d+\.\d+/);
});

test('cli: lists all skills with list command', async () => {
  const { stdout } = await execFileAsync(process.execPath, [CLI_PATH, 'list']);
  const clean = stripAnsi(stdout);
  assert.match(clean, /FRONTEND & UI\/UX SKILLS \(11\)/);
  assert.match(clean, /BACKEND & API ENGINEERING SKILLS \(9\)/);
  assert.match(clean, /use-backend/);
  assert.match(clean, /using-frontend/);
  assert.match(clean, /Total: 20 skills ready to install/);
});

test('cli: installs skills non-interactively with flags into target project', async () => {
  const tempProject = path.join(os.tmpdir(), 'test-cli-install-project');
  await fs.mkdir(tempProject, { recursive: true });

  const { stdout } = await execFileAsync(
    process.execPath,
    [
      CLI_PATH,
      'install',
      '--editor', 'vscode',
      '--scope', 'project',
      '--bundle', 'backend',
      '--yes',
      '--force'
    ],
    { cwd: tempProject }
  );

  const clean = stripAnsi(stdout);
  assert.match(clean, /✔ VS Code/);
  assert.match(clean, /9 skills installed/);

  // Verify skills written to tempProject/.vscode/skills/
  const skillFile = path.join(tempProject, '.vscode', 'skills', 'security', 'SKILL.md');
  const exists = await fs.stat(skillFile);
  assert.ok(exists.isFile());

  // Clean up
  await fs.rm(tempProject, { recursive: true, force: true });
});
