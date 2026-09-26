import path from 'node:path';
import process from 'node:process';
import { BaseAdapter } from './base.js';

export class OpenCodeAdapter extends BaseAdapter {
  constructor() {
    super(
      'opencode',
      'OpenCode',
      'Installs skills to ~/.config/opencode/skills/ or .opencode/skills/'
    );
  }

  resolveDestination({ scope, projectDir, homedir }) {
    if (scope === 'global') {
      if (process.platform === 'win32') {
        const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
        return path.join(appData, 'opencode', 'skills');
      }
      return path.join(homedir, '.config', 'opencode', 'skills');
    }
    return path.join(projectDir, '.opencode', 'skills');
  }

  async postInstall({ scope, destDir }) {
    if (scope === 'global') {
      return `OpenCode will load these skills globally from ${destDir}`;
    }
    return `OpenCode will load these skills in this workspace from ${destDir}`;
  }
}
