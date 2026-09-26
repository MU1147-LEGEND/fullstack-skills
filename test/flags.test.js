import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/flags.js';

test('flags: parses empty argv with defaults', () => {
  const result = parseArgs([]);
  assert.equal(result.command, 'interactive');
  assert.equal(result.editor, null);
  assert.equal(result.scope, null);
  assert.equal(result.bundle, null);
  assert.equal(result.yes, false);
  assert.equal(result.force, false);
  assert.equal(result.help, false);
  assert.equal(result.version, false);
});

test('flags: parses install command with long flags', () => {
  const result = parseArgs(['install', '--editor', 'claude-code', '--scope', 'global', '--bundle', 'fullstack', '--yes', '--force']);
  assert.equal(result.command, 'install');
  assert.equal(result.editor, 'claude-code');
  assert.equal(result.scope, 'global');
  assert.equal(result.bundle, 'fullstack');
  assert.equal(result.yes, true);
  assert.equal(result.force, true);
});

test('flags: parses short aliases and normalizes claude to claude-code', () => {
  const result = parseArgs(['-e', 'claude', '-s', 'project', '-b', 'frontend', '-y']);
  assert.equal(result.editor, 'claude-code');
  assert.equal(result.scope, 'project');
  assert.equal(result.bundle, 'frontend');
  assert.equal(result.yes, true);
});

test('flags: detects list, help, and version flags', () => {
  assert.equal(parseArgs(['--list']).list, true);
  assert.equal(parseArgs(['list']).command, 'list');
  assert.equal(parseArgs(['-h']).help, true);
  assert.equal(parseArgs(['--help']).help, true);
  assert.equal(parseArgs(['-v']).version, true);
  assert.equal(parseArgs(['--version']).version, true);
});

test('flags: throws error on invalid editor or scope', () => {
  assert.throws(() => parseArgs(['--editor', 'unknown-editor']), /Invalid editor/);
  assert.throws(() => parseArgs(['--scope', 'invalid-scope']), /Invalid scope/);
  assert.throws(() => parseArgs(['--bundle', 'invalid-bundle']), /Invalid bundle/);
});
