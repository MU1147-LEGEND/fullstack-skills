# Full-Stack Skills NPM Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and test the `fullstack-skills` NPM package and zero-dependency CLI installer that allows developers to install 20 curated Frontend & Backend AI skills into their desired environment (Claude Code CLI, Google Antigravity, OpenCode, VS Code) globally or at project-level.

**Architecture:** A lightweight Node.js 18+ ESM CLI without external dependencies. The core coordinates modular environment adapters (`claude`, `antigravity`, `opencode`, `vscode`) that resolve target directories cross-platform and copy skill assets with user-friendly ANSI output and robust flag support.

**Tech Stack:** Node.js 18+ (ESM, `node:fs/promises`, `node:path`, `node:os`, `node:readline/promises`, `node:process`), native `node:test` / assertions for automated testing.

**Spec:** [docs/superpowers/specs/2026-09-27-fullstack-skills-npm-package-design.md](file:///c:/Users/ullah/Desktop/Full-Stack-SKiill/docs/superpowers/specs/2026-09-27-fullstack-skills-npm-package-design.md)

## Global Constraints
- Node 18+ compatible ESM (`"type": "module"`).
- Zero external runtime dependencies in `package.json` for instant `npx` execution.
- Cross-platform path resolution (Windows, macOS, Linux).
- Support both interactive wizard and direct CLI flags (`-e/--editor`, `-s/--scope`, `-b/--bundle`, `-y/--yes`, `-f/--force`).

---

### Task 1: Package Scaffolding & Skills Directory Organization

**Files:**
- Create: `package.json`
- Create: `LICENSE`
- Organize: `skills/backend/` (9 skills from `premium-backend-engineering/skills`)
- Organize: `skills/frontend/` (11 skills from `premium-frontend-design/skills`)

**Interfaces:**
- Consumes: Existing files in `premium-backend-engineering` and `premium-frontend-design`.
- Produces: `package.json` with `"bin": { "fullstack-skills": "./bin/cli.js" }`, organized `skills/` directory.

- [ ] **Step 1: Create `package.json` and `LICENSE`**
  Write `package.json` with metadata, bin entry, repository, keywords, and files whitelist. Write MIT LICENSE.
- [ ] **Step 2: Copy and organize skills into `skills/backend` and `skills/frontend`**
  Ensure all 20 skills are cleanly arranged in `skills/backend/<skill-name>/SKILL.md` and `skills/frontend/<skill-name>/SKILL.md`.
- [ ] **Step 3: Verify skill counts and structure**
  Verify 9 backend skills and 11 frontend skills exist and have valid `SKILL.md` files.

---

### Task 2: Core Terminal UI & CLI Flags Parser

**Files:**
- Create: `src/ui.js`
- Create: `src/flags.js`
- Test: `test/flags.test.js`

**Interfaces:**
- Consumes: Node standard libraries (`node:readline`, `node:process`, `node:util`).
- Produces:
  - `parseArgs(argv)`: returns parsed & validated options `{ editor, scope, bundle, yes, force, list, help, version, unknown }`.
  - `ui`: methods `banner()`, `success()`, `error()`, `warn()`, `info()`, `select(question, choices)`, `confirm(question, defaultVal)`.

- [ ] **Step 1: Write tests for `src/flags.js`**
  Test argument parsing, aliases (`-e`, `-s`, `-b`), defaults, and validation of unknown/invalid choices.
- [ ] **Step 2: Run flags test to verify it fails**
- [ ] **Step 3: Implement `src/flags.js`**
  Parse flags without external dependencies, normalize lowercase inputs, return clean structured object.
- [ ] **Step 4: Implement `src/ui.js`**
  ANSI terminal styling, interactive prompt handling (with fallback for non-TTY environments), banners, spinners/steps.
- [ ] **Step 5: Verify flag tests pass**

---

### Task 3: Environment Target Adapters

**Files:**
- Create: `src/adapters/base.js`
- Create: `src/adapters/claude.js`
- Create: `src/adapters/antigravity.js`
- Create: `src/adapters/opencode.js`
- Create: `src/adapters/vscode.js`
- Test: `test/adapters.test.js`

**Interfaces:**
- Consumes: `src/adapters/base.js` (abstract adapter interface).
- Produces: Each adapter implements:
  - `id`: string (e.g. `'claude-code'`)
  - `name`: string (e.g. `'Claude Code CLI'`)
  - `resolvePath({ scope, projectDir, homedir })`: returns target destination directory.
  - `install({ skills, scope, projectDir, force })`: copies skills and performs environment-specific linking/indexing.

- [ ] **Step 1: Write tests for adapter path resolutions and installation behavior**
  Mock target directories in temporary test folder and verify destination structure for each editor.
- [ ] **Step 2: Run adapter tests to verify failure**
- [ ] **Step 3: Implement `src/adapters/base.js`**
  Common recursive copy utility, directory creation, collision/overwrite handling.
- [ ] **Step 4: Implement `claude.js`, `antigravity.js`, `opencode.js`, and `vscode.js`**
  Implement the exact paths and installation mechanisms defined in the design spec.
- [ ] **Step 5: Verify all adapter tests pass**

---

### Task 4: Installer Coordinator & Programmatic API

**Files:**
- Create: `src/installer.js`
- Create: `src/index.js`
- Test: `test/installer.test.js`

**Interfaces:**
- Consumes: Adapters from `src/adapters/`, skills from `skills/`.
- Produces:
  - `listSkills()`: returns metadata of all 20 skills.
  - `install(options)`: coordinates installation to one or all adapters.

- [ ] **Step 1: Write tests for installer coordinator**
  Test bundle filtering (`fullstack`, `frontend`, `backend`), adapter selection, and multi-adapter installation.
- [ ] **Step 2: Run installer tests to verify failure**
- [ ] **Step 3: Implement `src/installer.js` and `src/index.js`**
- [ ] **Step 4: Verify installer tests pass**

---

### Task 5: Executable CLI Entry Point

**Files:**
- Create: `bin/cli.js`
- Test: `test/cli.test.js`

**Interfaces:**
- Consumes: `src/flags.js`, `src/ui.js`, `src/installer.js`.
- Produces: Working CLI executable supporting interactive flow and non-interactive flags.

- [ ] **Step 1: Write end-to-end CLI tests**
  Execute `node bin/cli.js --help`, `node bin/cli.js --version`, `node bin/cli.js list`, and `node bin/cli.js install --editor vscode --scope project --bundle frontend --yes`.
- [ ] **Step 2: Run CLI tests to verify failure**
- [ ] **Step 3: Implement `bin/cli.js`**
  Add hashbang `#!/usr/bin/env node`, handle flags, handle interactive prompts when flags are missing, handle uncaught errors and SIGINT gracefully.
- [ ] **Step 4: Verify end-to-end CLI tests pass**

---

### Task 6: Documentation & NPM Packaging Verification

**Files:**
- Create: `README.md`
- Verify: `package.json` package bundle (`npm pack --dry-run`)

**Interfaces:**
- Consumes: All completed files.
- Produces: Polished README with installation instructions (`npm i -g fullstack-skills`, `npm i fullstack-skills`, `npx fullstack-skills`), environment setup guides, and verified npm pack manifest.

- [ ] **Step 1: Create comprehensive `README.md`**
  Include banners, quick start commands, editor-by-editor setup notes, list of all 20 skills, and npm publishing guide.
- [ ] **Step 2: Run `npm pack --dry-run` and inspect tarball contents**
  Ensure clean packaging: all source code, skills, and documentation are included, while temporary files and test output are excluded via `.npmignore` or `files` field.
