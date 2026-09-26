const VALID_EDITORS = new Set(['claude-code', 'claude', 'antigravity', 'opencode', 'vscode', 'all']);
const VALID_SCOPES = new Set(['project', 'global']);
const VALID_BUNDLES = new Set(['fullstack', 'frontend', 'backend']);

export function parseArgs(argv = []) {
  const result = {
    command: 'interactive',
    editor: null,
    scope: null,
    bundle: null,
    yes: false,
    force: false,
    list: false,
    help: false,
    version: false,
    unknown: []
  };

  const args = [...argv];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === 'install') {
      result.command = 'install';
      continue;
    }

    if (arg === 'list') {
      result.command = 'list';
      result.list = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }

    if (arg === '--version' || arg === '-v') {
      result.version = true;
      continue;
    }

    if (arg === '--list') {
      result.list = true;
      continue;
    }

    if (arg === '--yes' || arg === '-y') {
      result.yes = true;
      continue;
    }

    if (arg === '--force' || arg === '-f') {
      result.force = true;
      continue;
    }

    if (arg.startsWith('--editor=') || arg.startsWith('-e=')) {
      const val = arg.split('=')[1];
      result.editor = val;
      continue;
    }
    if (arg === '--editor' || arg === '-e') {
      result.editor = args[++i];
      continue;
    }

    if (arg.startsWith('--scope=') || arg.startsWith('-s=')) {
      const val = arg.split('=')[1];
      result.scope = val;
      continue;
    }
    if (arg === '--scope' || arg === '-s') {
      result.scope = args[++i];
      continue;
    }

    if (arg.startsWith('--bundle=') || arg.startsWith('-b=')) {
      const val = arg.split('=')[1];
      result.bundle = val;
      continue;
    }
    if (arg === '--bundle' || arg === '-b') {
      result.bundle = args[++i];
      continue;
    }

    result.unknown.push(arg);
  }

  // Normalization & Validation
  if (result.editor) {
    result.editor = result.editor.toLowerCase();
    if (result.editor === 'claude') result.editor = 'claude-code';
    if (!VALID_EDITORS.has(result.editor)) {
      throw new Error(`Invalid editor: "${result.editor}". Allowed values: claude-code, antigravity, opencode, vscode, all`);
    }
  }

  if (result.scope) {
    result.scope = result.scope.toLowerCase();
    if (!VALID_SCOPES.has(result.scope)) {
      throw new Error(`Invalid scope: "${result.scope}". Allowed values: project, global`);
    }
  }

  if (result.bundle) {
    result.bundle = result.bundle.toLowerCase();
    if (!VALID_BUNDLES.has(result.bundle)) {
      throw new Error(`Invalid bundle: "${result.bundle}". Allowed values: fullstack, frontend, backend`);
    }
  }

  if (result.editor || result.scope || result.bundle) {
    if (result.command === 'interactive') {
      result.command = 'install';
    }
  }

  return result;
}
