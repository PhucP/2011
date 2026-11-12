import test from 'node:test';
import assert from 'node:assert/strict';
import { photoOrder } from '../src/journey.js';
import { memories } from '../src/content.js';
import { artworks } from '../src/artboard.js';
import { access } from 'node:fs/promises';
test('Selecting any photo visits all memories once before the artboard', () => {
  for (let start = 0; start < memories.length; start++) {
    const order = photoOrder(start, memories.length);
    assert.equal(order[0], start);
    assert.equal(order.length, memories.length);
    assert.equal(new Set(order).size, memories.length);
    assert.deepEqual([...order].sort((a,b) => a-b), memories.map((_,i) => i));
  }
});

test('All eight pinned drawings and lightweight previews exist', async () => {
  assert.equal(artworks.length,8);
  for (const art of artworks) {
    await access(new URL('../'+art.src,import.meta.url));
    await access(new URL('../'+art.thumbnail,import.meta.url));
  }
});
test('Every memory has a real image and Vietnamese dedication', async () => {
  for (const item of memories) {
    await access(new URL('../' + item.src, import.meta.url));
    assert.ok(item.title && item.caption && item.lines.length >= 3);
  }
});
test('Invalid selection is rejected', () => {
  for (const [start, count] of [[-1,13],[13,13],[0,0],[0.5,13]]) assert.throws(() => photoOrder(start, count), RangeError);
});
