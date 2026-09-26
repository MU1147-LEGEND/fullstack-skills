import path from 'node:path';
import fs from 'node:fs/promises';
import { BaseAdapter } from './base.js';

export class AntigravityAdapter extends BaseAdapter {
  constructor() {
    super(
      'antigravity',
      'Google Antigravity',
      'Installs skills to ~/.gemini/config/skills/ or .agents/skills/'
    );
  }

  resolveDestination({ scope, projectDir, homedir }) {
    if (scope === 'global') {
      return path.join(homedir, '.gemini', 'config', 'skills');
    }
    return path.join(projectDir, '.agents', 'skills');
  }

  async postInstall({ scope, destDir }) {
    if (scope === 'global') {
      return `Antigravity will load these skills globally from ~/.gemini/config/skills/`;
    }
    return `Antigravity will load these skills in this workspace from .agents/skills/`;
  }
}
