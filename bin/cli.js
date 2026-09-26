#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { parseArgs } from '../src/flags.js';
import { ui, c } from '../src/ui.js';
import { installSkills, listSkills, getAdapters } from '../src/installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

async function getVersion() {
  try {
    const pkgJson = await fs.readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8');
    return JSON.parse(pkgJson).version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function printHelp(version) {
  ui.banner();
  console.log(`${c.bold}USAGE:${c.reset}`);
  console.log(`  ${c.cyan}npx fullstack-skills${c.reset}                    Launch interactive installer wizard`);
  console.log(`  ${c.cyan}fullstack-skills install [options]${c.reset}      Install skills with flags`);
  console.log(`  ${c.cyan}fullstack-skills list${c.reset}                   List all 20 skills & descriptions`);
  console.log(`  ${c.cyan}fullstack-skills --help${c.reset}                 Show this help message`);
  console.log(`  ${c.cyan}fullstack-skills --version${c.reset}              Show version number\n`);

  console.log(`${c.bold}OPTIONS:${c.reset}`);
  console.log(`  ${c.cyan}-e, --editor <id>${c.reset}        Target environment:`);
  console.log(`                            ${c.dim}claude-code | antigravity | opencode | vscode | all${c.reset}`);
  console.log(`  ${c.cyan}-s, --scope <type>${c.reset}       Installation scope:`);
  console.log(`                            ${c.dim}project (./) | global (~/)${c.reset}`);
  console.log(`  ${c.cyan}-b, --bundle <bundle>${c.reset}    Skill bundle:`);
  console.log(`                            ${c.dim}fullstack (20) | frontend (11) | backend (9)${c.reset}`);
  console.log(`  ${c.cyan}-y, --yes${c.reset}                Skip confirmation prompts`);
  console.log(`  ${c.cyan}-f, --force${c.reset}              Overwrite existing skill files`);
  console.log(`  ${c.cyan}-h, --help${c.reset}               Show help`);
  console.log(`  ${c.cyan}-v, --version${c.reset}            Show version\n`);

  console.log(`${c.bold}EXAMPLES:${c.reset}`);
  console.log(`  ${c.dim}# Interactive prompt:${c.reset}`);
  console.log(`  npx fullstack-skills\n`);
  console.log(`  ${c.dim}# Install full-stack to Claude Code globally:${c.reset}`);
  console.log(`  fullstack-skills install --editor claude-code --scope global --bundle fullstack\n`);
  console.log(`  ${c.dim}# Install frontend only to current VS Code project:${c.reset}`);
  console.log(`  fullstack-skills install --editor vscode --scope project --bundle frontend -y\n`);
  console.log(`  ${c.dim}# Install to all environments:${c.reset}`);
  console.log(`  npx fullstack-skills install --editor all --scope project --yes\n`);
}

async function handleList() {
  ui.banner();
  const skills = await listSkills();

  console.log(`${c.bold}${c.cyan}FRONTEND & UI/UX SKILLS (11):${c.reset}`);
  const frontend = skills.filter((s) => s.category === 'frontend');
  for (const s of frontend) {
    console.log(`  ${c.green}✔ ${c.bold}${s.name.padEnd(24)}${c.reset} ${c.dim}${s.description}${c.reset}`);
  }

  console.log(`\n${c.bold}${c.cyan}BACKEND & API ENGINEERING SKILLS (9):${c.reset}`);
  const backend = skills.filter((s) => s.category === 'backend');
  for (const s of backend) {
    console.log(`  ${c.green}✔ ${c.bold}${s.name.padEnd(24)}${c.reset} ${c.dim}${s.description}${c.reset}`);
  }
  console.log(`\nTotal: ${c.bold}20 skills${c.reset} ready to install.\n`);
}

async function main() {
  process.on('SIGINT', () => {
    console.log(`\n${c.yellow}Operation cancelled by user.${c.reset}`);
    process.exit(130);
  });

  const version = await getVersion();
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    ui.error(err.message);
    console.log(`Run ${c.cyan}fullstack-skills --help${c.reset} for usage details.`);
    process.exit(1);
  }

  if (args.help) {
    printHelp(version);
    return;
  }

  if (args.version) {
    console.log(`fullstack-skills v${version}`);
    return;
  }

  if (args.list) {
    await handleList();
    return;
  }

  ui.banner();

  let { editor, scope, bundle, yes, force } = args;

  // Interactive Flow if options are missing
  if (!editor || !scope || !bundle) {
    // 1. Detect Scope
    if (!scope) {
      let isProject = false;
      try {
        await fs.access(path.join(process.cwd(), 'package.json'));
        isProject = true;
      } catch {
        try {
          await fs.access(path.join(process.cwd(), '.git'));
          isProject = true;
        } catch {
          // not in project root
        }
      }

      ui.step(1, 3, 'Installation Scope');
      scope = await ui.select('Where would you like to install the skills?', [
        {
          label: 'Current Project',
          value: 'project',
          desc: isProject ? 'Recommended: Detected local repository' : 'Local folder (.claude / .agents / .vscode)'
        },
        {
          label: 'Global Machine',
          value: 'global',
          desc: 'Available everywhere on this machine'
        }
      ], isProject ? 0 : 1);
    }

    // 2. Select Target Environment
    if (!editor) {
      ui.step(2, 3, 'Target AI Environment');
      editor = await ui.select('Select the environment you want to configure:', [
        { label: 'Claude Code CLI', value: 'claude-code', desc: '~/.claude/skills/ or .claude/skills/' },
        { label: 'Google Antigravity', value: 'antigravity', desc: '~/.gemini/config/skills/ or .agents/skills/' },
        { label: 'OpenCode', value: 'opencode', desc: '~/.config/opencode/skills/ or .opencode/skills/' },
        { label: 'VS Code', value: 'vscode', desc: '.vscode/skills/ with Copilot / Cline / Roo support' },
        { label: 'All Environments', value: 'all', desc: 'Install and configure all 4 environments simultaneously' }
      ]);
    }

    // 3. Select Skill Bundle
    if (!bundle) {
      ui.step(3, 3, 'Skill Bundle');
      bundle = await ui.select('Select which skills you want to install:', [
        { label: 'Full Stack', value: 'fullstack', desc: 'Complete suite: All 20 Frontend & Backend Skills' },
        { label: 'Frontend UI/UX Only', value: 'frontend', desc: '11 design, accessibility, and UI skills' },
        { label: 'Backend Engineering Only', value: 'backend', desc: '9 architecture, API, security, and persistence skills' }
      ]);
    }

    // Confirmation if not -y
    if (!yes) {
      console.log(`\n${c.bold}Configuration Summary:${c.reset}`);
      console.log(`  • Environment: ${c.cyan}${editor}${c.reset}`);
      console.log(`  • Scope:       ${c.cyan}${scope}${c.reset}`);
      console.log(`  • Bundle:      ${c.cyan}${bundle}${c.reset}`);

      const proceed = await ui.confirm('\nProceed with installation?', true);
      if (!proceed) {
        console.log(`${c.yellow}Installation cancelled.${c.reset}`);
        return;
      }
    }
  }

  console.log(`\n${c.cyan}Installing skills...${c.reset}\n`);

  try {
    const summary = await installSkills({
      editor,
      scope,
      bundle,
      force
    });

    for (const res of summary.results) {
      console.log(`${c.green}${c.bold}✔ ${res.adapterName}${c.reset}`);
      console.log(`  ${c.dim}Path:${c.reset}  ${res.destination}`);
      console.log(`  ${c.dim}Count:${c.reset} ${c.bold}${res.installedCount}${c.reset} skills installed`);
      if (res.postNotes) {
        console.log(`  ${c.cyan}Tip:${c.reset}   ${res.postNotes}`);
      }
      console.log('');
    }

    console.log(`${c.green}${c.bold}🎉 Done! Successfully installed ${summary.selectedSkillsCount} skills.${c.reset}\n`);
  } catch (err) {
    ui.error(err.message);
    process.exit(1);
  }
}

main();
