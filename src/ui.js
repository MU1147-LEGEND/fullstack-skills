import readline from 'node:readline';
import process from 'node:process';

// ANSI escape sequences
export const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

export const ui = {
  banner() {
    console.log(`\n${c.cyan}${c.bold}================================================================${c.reset}`);
    console.log(`${c.cyan}${c.bold}  ⚡ fullstack-skills ${c.reset}${c.dim}v1.0.0${c.reset}`);
    console.log(`  ${c.white}Universal AI Skills for Claude Code, Antigravity, OpenCode & VS Code${c.reset}`);
    console.log(`${c.cyan}${c.bold}================================================================${c.reset}\n`);
  },

  info(msg) {
    console.log(`${c.cyan}ℹ${c.reset} ${msg}`);
  },

  success(msg) {
    console.log(`${c.green}${c.bold}✔${c.reset} ${msg}`);
  },

  warn(msg) {
    console.log(`${c.yellow}${c.bold}▲${c.reset} ${msg}`);
  },

  error(msg) {
    console.error(`${c.red}${c.bold}✖ Error:${c.reset} ${msg}`);
  },

  step(current, total, label) {
    console.log(`\n${c.cyan}${c.bold}[${current}/${total}]${c.reset} ${c.bold}${label}${c.reset}`);
  },

  async confirm(promptText, defaultVal = true) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const suffix = defaultVal ? '[Y/n]' : '[y/N]';
    return new Promise((resolve) => {
      rl.question(`${promptText} ${c.dim}${suffix}${c.reset} `, (answer) => {
        rl.close();
        const trimmed = answer.trim().toLowerCase();
        if (trimmed === '') return resolve(defaultVal);
        resolve(trimmed === 'y' || trimmed === 'yes');
      });
    });
  },

  async select(title, choices, defaultIndex = 0) {
    // If not a TTY or in non-interactive environment, use simple numeric prompt
    if (!process.stdin.isTTY) {
      return this._fallbackSelect(title, choices, defaultIndex);
    }

    return new Promise((resolve) => {
      let selected = defaultIndex;
      const stdin = process.stdin;
      const stdout = process.stdout;

      readline.emitKeypressEvents(stdin);
      if (stdin.isTTY) {
        stdin.setRawMode(true);
      }

      function render(firstTime = false) {
        if (!firstTime) {
          stdout.write(`\x1b[${choices.length}A`); // Move cursor up
        }
        for (let i = 0; i < choices.length; i++) {
          const isSelected = i === selected;
          const prefix = isSelected ? `${c.cyan}${c.bold}❯ ` : '  ';
          const label = isSelected ? `${c.cyan}${c.bold}${choices[i].label}${c.reset}` : `${choices[i].label}`;
          const desc = choices[i].desc ? ` ${c.dim}(${choices[i].desc})${c.reset}` : '';
          stdout.write(`\x1b[2K${prefix}${label}${desc}\n`); // Clear line and write
        }
      }

      render(true);

      function cleanup() {
        if (stdin.isTTY) {
          stdin.setRawMode(false);
        }
        stdin.removeListener('keypress', onKeypress);
      }

      function onKeypress(str, key) {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          process.exit(130);
        }

        if (key.name === 'up' || (key.name === 'k')) {
          selected = selected > 0 ? selected - 1 : choices.length - 1;
          render(false);
        } else if (key.name === 'down' || (key.name === 'j')) {
          selected = selected < choices.length - 1 ? selected + 1 : 0;
          render(false);
        } else if (key.name === 'return' || key.name === 'enter' || key.name === 'space') {
          cleanup();
          stdout.write('\n');
          resolve(choices[selected].value);
        } else if (/^[1-9]$/.test(str)) {
          const num = parseInt(str, 10) - 1;
          if (num >= 0 && num < choices.length) {
            selected = num;
            render(false);
          }
        }
      }

      stdin.on('keypress', onKeypress);
      stdin.resume();
    });
  },

  async _fallbackSelect(title, choices, defaultIndex = 0) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(title);
    choices.forEach((choice, idx) => {
      const isDefault = idx === defaultIndex ? ' [default]' : '';
      console.log(`  ${idx + 1}. ${choice.label}${choice.desc ? ` (${choice.desc})` : ''}${isDefault}`);
    });

    return new Promise((resolve) => {
      rl.question(`Select option (1-${choices.length}): `, (answer) => {
        rl.close();
        const num = parseInt(answer.trim(), 10);
        if (num >= 1 && num <= choices.length) {
          resolve(choices[num - 1].value);
        } else {
          resolve(choices[defaultIndex].value);
        }
      });
    });
  }
};
