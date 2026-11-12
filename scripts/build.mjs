import { mkdir, cp, access, writeFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { memories } from '../src/content.js';
import { artworks } from '../src/artboard.js';
// No dependencies or remote resources. All paths stay relative for project Pages.
for (const item of memories) await access(new URL('../' + item.src, import.meta.url));
for (const item of artworks) {
  await access(new URL('../'+item.src, import.meta.url));
  await access(new URL('../'+item.thumbnail, import.meta.url));
}
await access(new URL('../media/ky-niem.mp4', import.meta.url));
const projectRoot = path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const distRoot = path.resolve('dist');
if (distRoot !== path.join(projectRoot,'dist')) throw new Error('Run the build from the project root.');
// The checked absolute target is the generated dist folder in this project only.
await rm(distRoot,{recursive:true,force:true});
await mkdir(distRoot, { recursive: true });
// Copy an explicit allowlist so reference originals and editing notes never ship.
await cp('index.html', 'dist/index.html');
for (const name of ['src', 'media']) await cp(name, `dist/${name}`, { recursive:true });
await mkdir('dist/assets/fonts', {recursive:true});
for (const file of ['classroom-painting.webp','botanical-painting.webp','paper-painting.webp','sheer-painting.webp','books-painting.webp','envelope.svg','curtain.webp']) await cp(`assets/${file}`, `dist/assets/${file}`);
for (const file of await readdir('assets/fonts')) {
  if (/\.(ttf|woff|txt)$/.test(file)) await cp(`assets/fonts/${file}`, `dist/assets/fonts/${file}`);
}
await writeFile('dist/.nojekyll', '');
console.log(`Built dist/: ${memories.length} memories, local fonts, H.264 video. Ready for static hosting.`);
