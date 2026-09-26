<div align="center">

# ⚡ fullstack-skills

**Universal AI developer skills for modern Full-Stack Web Development.**  
Install 20 battle-tested engineering & UI/UX skills into your favorite AI coding environment in seconds.

[![npm version](https://img.shields.io/npm/v/fullstack-skills.svg?style=flat-square&color=00d26a)](https://www.npmjs.com/package/fullstack-skills)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fullstack-skills?style=flat-square&color=00d26a&label=minzipped%20size)](https://bundlephobia.com/package/fullstack-skills)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-true-brightgreen.svg?style=flat-square)](https://bundlephobia.com/package/fullstack-skills)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

</div>

---

## ⚡ 10-Second Quick Start

You don't even need to install anything permanently. Just run:

```bash
npx fullstack-skills
```

An interactive menu will guide you through picking your environment and skill bundle:

```text
================================================================
  ⚡ fullstack-skills v1.0.0
  Universal AI Skills for Claude Code, Antigravity, OpenCode & VS Code
================================================================

[1/3] Installation Scope:
  ❯ Current Project (./)      (Recommended: installs inside this repository)
    Global Machine (~/)       (Available in any project on your computer)

[2/3] Target AI Environment:
  ❯ Claude Code CLI           (~/.claude/skills/ or .claude/skills/)
    Google Antigravity        (~/.gemini/config/skills/ or .agents/skills/)
    OpenCode                  (~/.config/opencode/skills/ or .opencode/skills/)
    VS Code                   (.vscode/skills/ + Copilot / Cline / Roo)
    All Environments          (Set up all 4 simultaneously)

[3/3] Skill Bundle:
  ❯ Full Stack                (All 20 Frontend & Backend Skills)
    Frontend UI/UX Only       (11 Design, A11y, Layout & Motion Skills)
    Backend Only              (9 Architecture, API, Auth & DB Skills)

✔ Done! Installed 20 skills to ./.claude/skills/
```

---

## 📦 Installation Options

Choose the method that fits your workflow:

### Option A: Direct Execution (No Install)
```bash
npx fullstack-skills
```

### Option B: Install Globally (Run from any folder)
```bash
npm install -g fullstack-skills

# Run anywhere:
fullstack-skills
```

### Option C: Add to Current Project
```bash
npm install fullstack-skills

# Run the installer:
npx fullstack-skills
```

---

## 🎯 Supported Environments

| Environment | Global Location | Project Location | AI Extension / Agent Support |
| :--- | :--- | :--- | :--- |
| **Claude Code CLI** | `~/.claude/skills/` | `./.claude/skills/` | Native Claude Code skills |
| **VS Code** | `~/.vscode/skills/` | `./.vscode/skills/` | GitHub Copilot, Roo Code, Cline |
| **Google Antigravity** | `~/.gemini/config/skills/` | `./.agents/skills/` | Native Antigravity / Gemini agent skills |
| **OpenCode** | `~/.config/opencode/skills/` | `./.opencode/skills/` | OpenCode agent skill system |

> **VS Code Note**: When installed to a project, `fullstack-skills` automatically configures `.github/copilot-instructions.md` with an index referencing all installed skills so **GitHub Copilot**, **Cline**, and **Roo Code** instantly discover and enforce the skills!

---

## 🤖 How the Skills Work in Your AI Assistant

Once installed, your AI assistant will automatically use the skills as specialist playbooks:

1. **Backend Routing (`use-backend`)**:
   - When you say *"Build an auth API in FastAPI"* or *"Create an Express user router"*, the AI automatically detects your framework and follows `use-backend` &rarr; `backend-architecture` &rarr; `security` &rarr; `api-design` &rarr; `backend-qa`.
2. **Frontend Routing (`using-frontend`)**:
   - When you say *"Design a landing page with hero and pricing"*, the AI routes to `frontend-ui-ux` &rarr; `layout-composition` &rarr; `typography` &rarr; `motion-interaction` &rarr; `accessibility`.

---

## 🚀 Scriptable CLI Flags (CI / Power Users)

Bypass interactive prompts with command-line flags:

```bash
# Install all 20 skills to Claude Code globally:
fullstack-skills install -e claude-code -s global -b fullstack -y

# Install frontend only to current VS Code workspace:
fullstack-skills install -e vscode -s project -b frontend -y

# Install all skills across all 4 environments:
npx fullstack-skills install -e all -s project -y

# Force overwrite existing skill files:
fullstack-skills install -e claude-code -f

# List all available skills:
fullstack-skills list
```

### Flags Reference

| Flag | Shorthand | Options | Description |
| :--- | :--- | :--- | :--- |
| `--editor` | `-e` | `claude-code`, `antigravity`, `opencode`, `vscode`, `all` | Target environment |
| `--scope` | `-s` | `project`, `global` | Target directory level |
| `--bundle` | `-b` | `fullstack`, `frontend`, `backend` | Which skill set to install |
| `--yes` | `-y` | _boolean_ | Skip confirmation prompt |
| `--force` | `-f` | _boolean_ | Overwrite existing files |
| `--list` | | _boolean_ | Print all 20 skills & descriptions |
| `--help` | `-h` | _boolean_ | Show help and usage examples |
| `--version` | `-v` | _boolean_ | Print installed version |

---

## 📚 Complete Skills Catalog (20 Skills)

### 🎨 Frontend & UI/UX Design (11 Skills)
| Skill | Description |
| :--- | :--- |
| **`using-frontend`** | Master entry point and router for all frontend, component, and UI/UX tasks. |
| **`frontend-ui-ux`** | Design-first direction: visual hierarchy, whitespace rhythm, color harmony, and micro-interactions. |
| **`typography`** | Modular type scales, font pairing, line-height, and responsive typography rules. |
| **`layout-composition`** | Spatial grids, dynamic section rhythm, and modern container layouts. |
| **`responsive-design`** | Fluid breakpoints, responsive navigation, touch targets, and mobile-first adaptation. |
| **`shadcn-design-system`** | Radix primitives, Tailwind CSS tokens, and clean variant architectures. |
| **`motion-interaction`** | Micro-animations, scroll-driven interactions, and smooth CSS transitions. |
| **`accessibility`** | WCAG 2.1 AA compliance, keyboard navigation, focus rings, and screen reader semantics. |
| **`design-inspiration`** | Visual benchmark analysis from top modern SaaS, editorial, and ecommerce designs. |
| **`visual-qa`** | Layout overflow detection, contrast validation, and visual polish audits. |
| **`bangla-typography`** | Native Bengali/Bangla typography rules, font selections, and line-height calibration. |

### ⚙️ Backend & API Engineering (9 Skills)
| Skill | Description |
| :--- | :--- |
| **`use-backend`** | Master router: detects framework (Express, FastAPI, Django, Next.js, Go, Spring) and routes tasks. |
| **`backend-architecture`** | Clean layering (Controller &rarr; Service &rarr; Repository), dependency injection, and modular structure. |
| **`api-design`** | RESTful API design, request/response models, pagination, JSON envelopes, and status codes. |
| **`security`** | Authentication (JWT/OAuth), authorization (RBAC/ABAC), injection prevention, CORS, and OWASP hardening. |
| **`data-persistence`** | Database schemas, ORM queries, migrations, atomic transactions, and N+1 query elimination. |
| **`performance-scalability`** | Redis caching, async task queues, non-blocking I/O, and latency profiling. |
| **`rate-limiting-resilience`** | Exponential backoff, jitter, circuit breakers, timeouts, and DDoS protections. |
| **`observability`** | Structured JSON logging, correlation IDs, health checks (`/health/live`, `/health/ready`), and metrics. |
| **`backend-qa`** | Pre-ship verification checklists, contract tests, and test runner execution. |

---

## 🗜️ Ultra-Lightweight & Gzip-Compressed

- **Bundle Size**: Only **4.1 kB** (minified + gzipped) / **10.9 kB** minified on [Bundlephobia](https://bundlephobia.com/package/fullstack-skills).
- **Zero dependencies**: 0 runtime dependencies, 0 security warnings.
- **Lightning fast**: Under 5ms download time on 4G networks.
- **Tree-shakeable**: Native ESM modular architecture.

---

## 🤝 Contributing & Local Development

```bash
# Clone the repository
git clone https://github.com/MU1147-LEGEND/fullstack-skills.git
cd fullstack-skills

# Run tests (100% pass)
npm test

# Try the CLI locally
node bin/cli.js
```

---

## 📄 License

MIT &copy; 2026 [MU1147-LEGEND](https://github.com/MU1147-LEGEND)
