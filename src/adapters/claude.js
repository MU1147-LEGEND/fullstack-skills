import path from 'node:path';
import { BaseAdapter } from './base.js';

export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super(
      'claude-code',
      'Claude Code CLI',
      'Installs skills to ~/.claude/skills/ or .claude/skills/ for Claude Code'
    );
  }

  resolveDestination({ scope, projectDir, homedir }) {
    if (scope === 'global') {
      return path.join(homedir, '.claude', 'skills');
    }
    return path.join(projectDir, '.claude', 'skills');
  }

  async postInstall({ scope, destDir }) {
    if (scope === 'global') {
      return `Claude Code will automatically recognize all skills globally from ${destDir}`;
    }
    return `Claude Code will automatically recognize all skills in this repository from ${destDir}`;
  }
}
