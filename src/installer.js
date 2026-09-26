import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ClaudeAdapter } from './adapters/claude.js';
import { AntigravityAdapter } from './adapters/antigravity.js';
import { OpenCodeAdapter } from './adapters/opencode.js';
import { VSCodeAdapter } from './adapters/vscode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');

export function getAdapters() {
  return {
    'claude-code': new ClaudeAdapter(),
    antigravity: new AntigravityAdapter(),
    opencode: new OpenCodeAdapter(),
    vscode: new VSCodeAdapter(),
  };
}

export async function listSkills(skillsBaseDir = SKILLS_DIR) {
  const skills = [];
  const categories = ['backend', 'frontend'];

  for (const cat of categories) {
    const catDir = path.join(skillsBaseDir, cat);
    try {
      const entries = await fs.readdir(catDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(catDir, entry.name);
          const skillMdPath = path.join(skillPath, 'SKILL.md');

          let description = '';
          try {
            const content = await fs.readFile(skillMdPath, 'utf8');
            const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/);
            if (match) {
              const yaml = match[1];
              const descMatch = yaml.match(/description:\s*(?:>[-+]?|\|[-+]?)?\s*\n?((?:(?:\s{2,}|\t)[^\n\r]+(?:\r?\n|$))+|[^\n\r]+)/);
              if (descMatch) {
                description = descMatch[1]
                  .split(/\r?\n/)
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .join(' ')
                  .replace(/^['"]|['"]$/g, '');
              }
            }
          } catch {
            // ignore missing SKILL.md
          }

          skills.push({
            name: entry.name,
            category: cat,
            path: skillPath,
            description: description || 'Specialized full-stack development skill'
          });
        }
      }
    } catch {
      // directory might not exist yet
    }
  }

  return skills;
}

export async function installSkills({
  editor = 'all',
  scope = 'project',
  bundle = 'fullstack',
  projectDir = process.cwd(),
  homedir,
  force = false,
  skillsBaseDir = SKILLS_DIR
}) {
  const allSkills = await listSkills(skillsBaseDir);

  let selectedSkills = allSkills;
  if (bundle === 'frontend') {
    selectedSkills = allSkills.filter((s) => s.category === 'frontend');
  } else if (bundle === 'backend') {
    selectedSkills = allSkills.filter((s) => s.category === 'backend');
  }

  if (selectedSkills.length === 0) {
    throw new Error(`No skills found for bundle: ${bundle}`);
  }

  const adaptersMap = getAdapters();
  let targetAdapters = [];

  if (editor === 'all') {
    targetAdapters = Object.values(adaptersMap);
  } else {
    const adapter = adaptersMap[editor];
    if (!adapter) {
      throw new Error(`Unknown editor target: "${editor}"`);
    }
    targetAdapters = [adapter];
  }

  const results = [];

  for (const adapter of targetAdapters) {
    const res = await adapter.install({
      skills: selectedSkills,
      scope,
      projectDir,
      homedir,
      force,
    });
    results.push(res);
  }

  return {
    editor,
    scope,
    bundle,
    selectedSkillsCount: selectedSkills.length,
    results,
  };
}
