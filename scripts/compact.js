import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSkills } from '../src/installer.js';
import { compactor } from '../src/compactor.js';
import { c } from '../src/ui.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

async function run() {
  console.log(`${c.cyan}${c.bold}⚡ Compacting fullstack-skills with gzip compression...${c.reset}\n`);

  const skills = await listSkills(path.join(PACKAGE_ROOT, 'skills'));
  console.log(`Found ${c.bold}${skills.length}${c.reset} skills to bundle.\n`);

  const bundle = await compactor.createBundle(skills);

  const bundlePath = path.join(PACKAGE_ROOT, 'skills.bundle.json.gz');
  await fs.writeFile(bundlePath, bundle.compressed);

  console.log(`${c.green}${c.bold}✔ Compression complete!${c.reset}`);
  console.log(`  Raw size:        ${(bundle.rawSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`  Gzipped bundle:  ${c.bold}${(bundle.compressedSizeBytes / 1024).toFixed(2)} KB${c.reset}`);
  console.log(`  Saved:           ${c.cyan}${bundle.ratio}${c.reset} space reduced!`);
  console.log(`\nBundle saved to: ${bundlePath}`);
}

run().catch((err) => {
  console.error('Compaction failed:', err);
  process.exit(1);
});
