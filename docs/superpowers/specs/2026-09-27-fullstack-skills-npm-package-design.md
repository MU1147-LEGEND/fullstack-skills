# Full-Stack Skills NPM Package & CLI Installer — Design Specification

**Date:** 2026-09-27  
**Status:** Approved  
**Package Name:** `fullstack-skills`  
**Description:** Universal distribution and installer CLI for 20 premium Frontend & Backend engineering skills across AI-assisted developer environments (Claude Code CLI, Google Antigravity, OpenCode, VS Code).

---

## 1. Overview & Goals

Developers use diverse AI coding agents and environments. Today, the repository contains 20 curated skills:
- **Backend Engineering (9 skills):** `api-design`, `backend-architecture`, `backend-qa`, `data-persistence`, `observability`, `performance-scalability`, `rate-limiting-resilience`, `security`, `use-backend`.
- **Frontend & UI/UX (11 skills):** `accessibility`, `bangla-typography`, `design-inspiration`, `frontend-ui-ux`, `layout-composition`, `motion-interaction`, `responsive-design`, `shadcn-design-system`, `typography`, `using-frontend`, `visual-qa`.

The goal of `fullstack-skills` is to package these skills into an npm package that:
1. Can be installed globally (`npm i -g fullstack-skills`) or locally in a project (`npm i fullstack-skills` or executed via `npx fullstack-skills`).
2. Provides an interactive, zero-external-dependency CLI wizard to choose target environment, installation scope, and skill bundle.
3. Provides full non-interactive flag support for scripts, CI, and power users.
4. Seamlessly adapts to directory structures and conventions of:
   - **Claude Code CLI**
   - **Google Antigravity**
   - **OpenCode**
   - **VS Code** (GitHub Copilot, Cline, Roo Code, Prompts)

---

## 2. Package & Directory Structure

```text
Full-Stack-SKiill/
├── package.json                 # npm package manifest with bin, keywords, repository, etc.
├── README.md                    # Comprehensive documentation and usage guide
├── LICENSE                      # MIT License
├── bin/
│   └── cli.js                   # CLI entry point (`#!/usr/bin/env node`)
├── src/
│   ├── index.js                 # Programmatic JavaScript API
│   ├── ui.js                    # Zero-dependency terminal formatting, ANSI colors, prompts
│   ├── flags.js                 # Argument parser & flag validator
│   ├── installer.js             # Core installation coordinator
│   └── adapters/
│       ├── base.js              # Base adapter interface with abstract methods
│       ├── claude.js            # Claude Code CLI adapter (~/.claude/skills, .claude/skills)
│       ├── antigravity.js       # Antigravity adapter (~/.gemini/config/plugins or .agents/skills)
│       ├── opencode.js          # OpenCode adapter (~/.config/opencode/skills, .opencode/skills)
│       └── vscode.js            # VS Code adapter (.vscode/skills, .github/copilot-instructions.md)
└── skills/
    ├── backend/                 # 9 backend skills (each containing SKILL.md + assets)
    └── frontend/                # 11 frontend skills (each containing SKILL.md + assets)
```

---

## 3. Supported Target Environments & File System Paths

### 3.1 Claude Code CLI (`claude-code`)
- **Global Destination:**
  - POSIX: `~/.claude/skills/<skill-name>/SKILL.md`
  - Windows: `%USERPROFILE%\.claude\skills\<skill-name>\SKILL.md`
- **Project Destination:**
  - `./.claude/skills/<skill-name>/SKILL.md`
- **Behavior:** Copies individual skill directories directly. Claude Code automatically scans `.claude/skills` and `~/.claude/skills` for skills.

### 3.2 Google Antigravity (`antigravity`)
- **Global Destination:**
  - `~/.gemini/config/plugins/premium-backend-engineering/` and `~/.gemini/config/plugins/premium-frontend-design/` (with their corresponding `plugin.json` and `skills/`)
  - Alternatively direct skills in `~/.gemini/config/skills/`
- **Project Destination:**
  - `./.agents/skills/<skill-name>/SKILL.md` (or `./.agents/plugins/`)
- **Behavior:** Antigravity auto-discovers plugins in `~/.gemini/config/plugins/` and project skills in `.agents/skills/`.

### 3.3 OpenCode (`opencode`)
- **Global Destination:**
  - Linux/macOS: `~/.config/opencode/skills/<skill-name>/SKILL.md`
  - Windows: `%APPDATA%\opencode\skills\<skill-name>\SKILL.md` (fallback: `%USERPROFILE%\.config\opencode\skills\`)
- **Project Destination:**
  - `./.opencode/skills/<skill-name>/SKILL.md`
- **Behavior:** Copies skills into the OpenCode skills folder.

### 3.4 VS Code (`vscode`)
- **Global Destination:**
  - `~/.vscode/skills/<skill-name>/SKILL.md`
- **Project Destination:**
  - `./.vscode/skills/<skill-name>/SKILL.md`
  - Plus optionally creates/updates `.github/copilot-instructions.md` with an index referencing all installed skills so GitHub Copilot and other assistants immediately recognize them.
- **Behavior:** Installs skills and generates/updates an index file so that any VS Code AI extension (Copilot, Cline, Roo Code) has clear guidance on how to invoke the skills.

---

## 4. CLI Architecture & User Experience

### 4.1 Zero-Dependency Implementation
- Built using native Node.js 18+ built-ins (`node:fs/promises`, `node:path`, `node:os`, `node:readline/promises`, `node:process`).
- Guaranteed instant install & run via `npx fullstack-skills` with 0 security warnings and 0 dependency bloat.

### 4.2 Interactive Wizard
When run without arguments:
1. **Scope Selection:**
   - Detects if running inside an existing git repository or node project.
   - Pre-selects `Current Project (./)` if in a project, or `Global (~/)` if run from home directory.
2. **Environment Selection:**
   - `Claude Code CLI (claude-code)`
   - `Google Antigravity (antigravity)`
   - `OpenCode (opencode)`
   - `VS Code (vscode)`
   - `All Environments`
3. **Bundle Selection:**
   - `Full Stack (All 20 Skills)`
   - `Frontend UI/UX Only (11 Skills)`
   - `Backend Engineering Only (9 Skills)`
4. **Execution & Report:**
   - Copies files with directory creation.
   - Displays clear success summary and environment-specific activation tips.

### 4.3 Command-Line Flags
- `fullstack-skills install [options]`
  - `-e, --editor <id>`: `claude-code`, `antigravity`, `opencode`, `vscode`, `all`
  - `-s, --scope <type>`: `project`, `global`
  - `-b, --bundle <type>`: `fullstack`, `frontend`, `backend`
  - `-y, --yes`: Skip interactive prompts and confirm defaults
  - `-f, --force`: Overwrite existing skill files if already present
- `fullstack-skills list`:
  - Lists all 20 skills categorized by Frontend and Backend with brief summaries.
- `fullstack-skills --help` / `-h`:
  - Prints usage guide and examples.
- `fullstack-skills --version` / `-v`:
  - Prints package version.

---

## 5. Error Handling & Edge Cases

1. **Permission Errors:** Cleanly catch EACCES / EPERM and provide friendly guidance (e.g. running with proper directory permissions).
2. **Existing Files:** By default, asks before overwriting or provides summary of updated files. With `--force`, overwrites cleanly.
3. **Missing Dirs:** Automatically recursively creates missing destination directories (`mkdir -p`).
4. **OS Paths:** Cross-platform path resolution using `node:os.homedir()` and `node:path` normalization for Windows, macOS, and Linux.

---

## 6. Verification & Testing

1. **CLI Flag Tests:** Run `bin/cli.js --help`, `bin/cli.js --version`, and `bin/cli.js list`.
2. **Dry Run / Project Installation Test:** Run installation targeting a local test directory for each adapter (`claude-code`, `antigravity`, `opencode`, `vscode`, `all`).
3. **Verify Installed Content:** Confirm `SKILL.md` contents and integrity in destination folders.
4. **Packaging Verification:** Test `npm pack --dry-run` to ensure all necessary files (`bin`, `src`, `skills`, `README.md`, `LICENSE`) are included in the published npm tarball and no unnecessary clutter is published.
