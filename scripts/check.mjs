import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const directory of ['src', 'data', 'scripts', 'tests']) {
  for (const name of await readdir(new URL(`../${directory}/`, import.meta.url))) {
    if (!/\.m?js$/.test(name)) continue;
    const result = spawnSync(process.execPath, ['--check', `${directory}/${name}`], { cwd: root, stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
  await readFile(new URL(`../${match[1]}`, import.meta.url));
}
console.log('All JavaScript parses and local HTML assets exist.');
