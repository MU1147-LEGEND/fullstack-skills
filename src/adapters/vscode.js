import path from 'node:path';
import fs from 'node:fs/promises';
import { BaseAdapter } from './base.js';

export class VSCodeAdapter extends BaseAdapter {
  constructor() {
    super(
      'vscode',
      'VS Code (Copilot / Cline / Roo / Prompts)',
      'Installs skills to .vscode/skills/ with Copilot & AI agent integration'
    );
  }

  resolveDestination({ scope, projectDir, homedir }) {
    if (scope === 'global') {
      return path.join(homedir, '.vscode', 'skills');
    }
    return path.join(projectDir, '.vscode', 'skills');
  }

  async postInstall({ scope, projectDir, skills }) {
    if (scope === 'project') {
      try {
        const githubDir = path.join(projectDir, '.github');
        await this.ensureDir(githubDir);

        const copilotInstructionsPath = path.join(githubDir, 'copilot-instructions.md');
        let existingContent = '';
        try {
          existingContent = await fs.readFile(copilotInstructionsPath, 'utf8');
        } catch {
          // File does not exist yet
        }

        const marker = '<!-- FULLSTACK-SKILLS-INDEX-START -->';
        const endMarker = '<!-- FULLSTACK-SKILLS-INDEX-END -->';

        const skillList = skills.map((s) => `- **${s.name}**: \`.vscode/skills/${s.name}/SKILL.md\``).join('\n');
        const section = `${marker}\n## Full-Stack AI Skills Library\n\nThe following engineering and design skills are installed in \`.vscode/skills/\`. Review and follow them when answering relevant engineering tasks:\n\n${skillList}\n${endMarker}`;

        let newContent = '';
        if (existingContent.includes(marker)) {
          newContent = existingContent.replace(
            new RegExp(`${marker}[\\s\\S]*?${endMarker}`),
            section
          );
        } else {
          newContent = existingContent
            ? `${existingContent.trim()}\n\n${section}\n`
            : `${section}\n`;
        }

        await fs.writeFile(copilotInstructionsPath, newContent, 'utf8');
        return `Configured .vscode/skills/ and updated .github/copilot-instructions.md for Copilot & AI extensions`;
      } catch (err) {
        return `Installed to .vscode/skills/ (Could not update copilot-instructions: ${err.message})`;
      }
    }
    return `Installed to global ~/.vscode/skills/`;
  }
}
