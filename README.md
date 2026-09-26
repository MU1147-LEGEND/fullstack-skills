# ⚡ fullstack-skills

> Universal, zero-dependency NPM package and CLI installer for **20 premium Frontend & Backend engineering skills** for AI coding assistants.

Supports **Claude Code CLI**, **Google Antigravity**, **OpenCode**, and **VS Code** (GitHub Copilot, Cline, Roo Code, Prompts).

---

## 🚀 Quick Start

Run instantly without installing anything:

```bash
npx fullstack-skills
```

Or install globally on your machine:

```bash
npm install -g fullstack-skills

# Then run anywhere:
fullstack-skills
```

Or add as a project dependency:

```bash
npm install fullstack-skills

# Run project installer:
npx fullstack-skills
```

---

## 🎯 Supported Environments & Installation Locations

| Target Environment | Key | Global Path (`--scope global`) | Project Path (`--scope project`) | How It Works |
| :--- | :--- | :--- | :--- | :--- |
| **Claude Code CLI** | `claude-code` | `~/.claude/skills/` | `./.claude/skills/` | Claude Code natively scans and activates skills automatically. |
| **Google Antigravity** | `antigravity` | `~/.gemini/config/skills/` | `./.agents/skills/` | Antigravity auto-discovers global skills and workspace `.agents/skills/`. |
| **OpenCode** | `opencode` | `~/.config/opencode/skills/` | `./.opencode/skills/` | OpenCode natively loads skills from its skill directories. |
| **VS Code** | `vscode` | `~/.vscode/skills/` | `./.vscode/skills/` | Installs skills and configures `.github/copilot-instructions.md` for Copilot, Roo Code, and Cline. |
| **All Environments** | `all` | Installs to all global targets | Installs to all project targets | Sets up every environment simultaneously. |

---

## 🎛️ Interactive Wizard & Non-Interactive Flags

### 1. Interactive Mode
Simply run `npx fullstack-skills` or `fullstack-skills`. An interactive CLI menu will guide you:
1. **Scope Selection**: Current Project (`./`) or Global Machine (`~/`)
2. **Environment**: Claude Code, Antigravity, OpenCode, VS Code, or All
3. **Bundle**: Full Stack (20 skills), Frontend Only (11 skills), or Backend Only (9 skills)

### 2. Command-Line Flags (Scriptable & CI-ready)

```bash
# Install all 20 skills to Claude Code globally:
fullstack-skills install --editor claude-code --scope global --bundle fullstack

# Install frontend skills to the current VS Code workspace:
fullstack-skills install --editor vscode --scope project --bundle frontend -y

# Install all skills to all environments in current project:
npx fullstack-skills install --editor all --scope project --yes

# Overwrite existing skill files:
fullstack-skills install --editor opencode --force

# List all available skills and descriptions:
fullstack-skills list
```

### Options Reference:

| Flag | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--editor <id>` | `-e` | Target environment: `claude-code`, `antigravity`, `opencode`, `vscode`, `all` | Prompts / `all` |
| `--scope <type>` | `-s` | Installation scope: `project` or `global` | Auto-detects project root |
| `--bundle <type>` | `-b` | Skill bundle: `fullstack`, `frontend`, `backend` | Prompts / `fullstack` |
| `--yes` | `-y` | Skip confirmation prompt | `false` |
| `--force` | `-f` | Overwrite existing skill files | `false` |
| `--list` | | List all 20 skills & descriptions | |
| `--help` | `-h` | Display help screen | |
| `--version` | `-v` | Display package version | |

---

## 📚 The 20 Curated Skills

### 🎨 Frontend & UI/UX Design (11 Skills)
- **`using-frontend`**: Master entry point and router for all frontend UI/UX work across design systems.
- **`frontend-ui-ux`**: Design-first direction: visual hierarchy, whitespace rhythm, color harmony, and micro-interactions.
- **`typography`**: Modular type scales, font pairing, line-height, and responsive type systems.
- **`layout-composition`**: Spatial grids, dynamic section rhythm, and modern container layouts.
- **`responsive-design`**: Fluid breakpoints, responsive navigation, touch targets, and mobile-first adaptation.
- **`shadcn-design-system`**: Radix primitives, Tailwind CSS component design tokens, and clean variant architectures.
- **`motion-interaction`**: Micro-animations, scroll-driven interactions, and smooth CSS transitions.
- **`accessibility`**: WCAG 2.1 AA compliance, keyboard navigation, focus indicators, and screen reader semantics.
- **`design-inspiration`**: Aesthetic research across modern SaaS, editorial, and ecommerce design benchmarks.
- **`visual-qa`**: Layout overflow detection, contrast validation, and visual polish audits.
- **`bangla-typography`**: Native Bengali/Bangla typography rules, font selections, and line-height calibration.

### ⚙️ Backend & API Engineering (9 Skills)
- **`use-backend`**: Master router for backend engineering: detects framework (Express, FastAPI, Django, Next.js, etc.) and routes tasks.
- **`backend-architecture`**: Clean layering (Controller &rarr; Service &rarr; Repository), dependency injection, and modular structure.
- **`api-design`**: RESTful API conventions, request/response models, pagination, JSON envelopes, and status codes.
- **`security`**: Authentication (JWT/OAuth), authorization (RBAC/ABAC), injection prevention, CORS, and OWASP hardening.
- **`data-persistence`**: Database schemas, ORM queries, migrations, atomic transactions, and N+1 query elimination.
- **`performance-scalability`**: Redis caching, async task queues, non-blocking I/O, and latency profiling.
- **`rate-limiting-resilience`**: Exponential backoff, jitter, circuit breakers, timeouts, and DDoS protections.
- **`observability`**: Structured JSON logging, correlation IDs, health checks (`/health/live`, `/health/ready`), and metrics.
- **`backend-qa`**: Pre-ship verification checklists, contract tests, and test runner execution.

---

## 🗜️ Built-in Gzip Compaction

The package includes a built-in compression engine (`scripts/compact.js` and `src/compactor.js`) using Node's native `node:zlib`:

```bash
npm run compact
```

Compacts all 20 skills into a single high-density gzipped archive, reducing payload size by **over 62%** (~36 KB).

---

## 📦 Publishing to NPM

To publish this package to the npm registry:

1. **Log in to your npm account**:
   ```bash
   npm login
   ```
2. **Verify package name availability**:
   Ensure `fullstack-skills` (or your scoped `@username/fullstack-skills`) is set in `package.json`.
3. **Dry-run verification**:
   ```bash
   npm pack --dry-run
   ```
4. **Publish**:
   ```bash
   npm publish --access public
   ```

---

## 📄 License

MIT &copy; 2026 fullstack-skills contributors
