import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tools = [
  ['brew', 'Kortex Brew'], ['deposit', 'Kortex Deposit'], ['focus', 'Kortex Focus'],
  ['guide', 'Kortex Guide'], ['memo', 'Kortex Memo'], ['pantry', 'Kortex Pantry Safety'],
  ['proof', 'Kortex Proof'], ['recall', 'Kortex Recall'], ['return', 'Kortex Return'],
];

test('all nine PWAs have a complete installable shell', async () => {
  for (const [slug, name] of tools) {
    const toolRoot = path.join(root, 'public', 'tools', slug);
    const [manifestText, index, worker] = await Promise.all([
      readFile(path.join(toolRoot, 'manifest.webmanifest'), 'utf8'),
      readFile(path.join(toolRoot, 'index.html'), 'utf8'),
      readFile(path.join(toolRoot, 'service-worker.js'), 'utf8'),
    ]);
    const manifest = JSON.parse(manifestText);
    assert.equal(manifest.name, name);
    assert.equal(manifest.start_url, './');
    assert.equal(manifest.scope, './');
    assert.equal(manifest.display, 'standalone');
    assert.match(index, /manifest\.webmanifest/);
    assert.match(index, /boot\.mjs/);
    assert.match(worker, /index\.html/);
    assert.match(worker, /runtime\.mjs/);
  }
});

test('product calculations retain their domain behavior', async () => {
  const config = async slug => import(pathToFileURL(path.join(root, 'public', 'tools', slug, 'config.mjs')).href);
  const brew = await config('brew');
  assert.equal(brew.compute({ coffee: 20, water: 320, seconds: 180, temperature: 200, rating: 9, method: 'Pour over', note: 'Sweet' }).ratioLabel, '1:16.0');

  const deposit = await config('deposit');
  assert.equal(deposit.compute({ property: 'Apt 1', inspectionDate: '2026-07-22', rooms: 2, photos: [{}, {}], issues: 'Scratch', signed: true }).coverage, 48);

  const focus = await config('focus');
  assert.equal(focus.compute({ intention: 'Finish launch', minutes: 25, friction: 'social' }).minutes, 25);

  const guide = await config('guide');
  assert.equal(guide.compute({ route: 'riverwalk', pace: 'quick', note: '' }).minutes, 68);

  const memo = await config('memo');
  assert.equal(memo.compute({ memo: 'We reviewed the launch. I need to send the final update.', format: 'meeting' }).actions.length, 1);

  const pantry = await config('pantry');
  assert.equal(pantry.compute({ product: 'Peanut butter', lot: 'ABC' }).source, 'openFDA');

  const proof = await config('proof');
  assert.equal(proof.compute({ title: 'Damage', occurredAt: '2026-07-22T12:00', description: 'Delivery damage to the front door was visible after arrival.', witness: 'Case 12', evidence: [] }).readiness, 40);

  const recall = await config('recall');
  assert.equal(recall.compute({ product: 'Power bank', brand: 'Example' }).source, 'CPSC');

  const returns = await config('return');
  assert.equal(returns.compute({ item: 'Headphones', retailer: 'Shop', purchaseDate: '2026-07-01', windowDays: 30, receipt: [] }, new Date('2026-07-22T12:00:00')).status, 'Soon');
});
