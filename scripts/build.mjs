import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// Only this fixed generated directory may be replaced; never accept an output path from input.
if (dirname(output) !== resolve(root)) throw new Error('Output must stay inside the project.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of ['index.html', 'styles.css', 'src', 'data', 'assets']) {
  await cp(resolve(root, path), resolve(output, path), { recursive: true });
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Static site ready in dist/ (source, assets and relative URLs; no bundling required).');
