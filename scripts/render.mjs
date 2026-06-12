#!/usr/bin/env node
// Usage: npm run render -- episode-01
// Renders the given composition to out/<episode-id>.mp4
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const episodeId = process.argv[2];
if (!episodeId) {
  console.error('Usage: npm run render -- <episode-id>   (e.g. episode-01)');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
mkdirSync(outDir, {recursive: true});
const outFile = path.join(outDir, `${episodeId}.mp4`);

execFileSync(
  'npx',
  ['remotion', 'render', 'src/index.ts', episodeId, outFile, '--codec', 'h264'],
  {cwd: root, stdio: 'inherit'}
);

console.log(`\nDone: ${outFile}`);
