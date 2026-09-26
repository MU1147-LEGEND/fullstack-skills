import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export class BaseAdapter {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  resolveDestination({ scope, projectDir = process.cwd(), homedir = os.homedir() }) {
    throw new Error('resolveDestination must be implemented by adapter');
  }

  async ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async copyDir(src, dest, force = false) {
    await this.ensureDir(dest);
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath, force);
      } else {
        if (!force) {
          try {
            await fs.access(destPath);
            // File exists, skip if not force
            continue;
          } catch {
            // File does not exist, proceed
          }
        }
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async install({ skills, scope, projectDir = process.cwd(), homedir = os.homedir(), force = false }) {
    const destDir = this.resolveDestination({ scope, projectDir, homedir });
    await this.ensureDir(destDir);

    const installedSkills = [];

    for (const skill of skills) {
      const targetSkillDir = path.join(destDir, skill.name);
      await this.copyDir(skill.path, targetSkillDir, force);
      installedSkills.push(skill.name);
    }

    const postNotes = await this.postInstall({ destDir, skills, scope, projectDir, homedir, force });

    return {
      adapterId: this.id,
      adapterName: this.name,
      destination: destDir,
      installedCount: installedSkills.length,
      skills: installedSkills,
      postNotes: postNotes || null
    };
  }

  async postInstall(context) {
    return null;
  }
}
