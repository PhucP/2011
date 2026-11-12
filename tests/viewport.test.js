import test from 'node:test';
import assert from 'node:assert/strict';
import { fitScene } from '../src/viewport.js';
test('Laptop and projector layouts fit without stretching or cutting the scene', () => {
  for (const [width,height] of [[1366,610],[1440,730],[1920,920],[1024,610],[1280,640],[844,330]]) {
    const fit = fitScene(width,height);
    assert.ok(fit.width <= width+1e-8 && fit.height <= height+1e-8);
    assert.ok(Math.abs(fit.width/fit.height - 16/9) < 1e-8);
    assert.equal(fit.width/fit.logicalWidth,fit.scale);
    assert.equal(fit.height/fit.logicalHeight,fit.scale);
  }
});
test('Portrait and rotated phone views stay fully within their available bounds', () => {
  for (const [width,height] of [[296,430],[351,510],[366,680],[414,740]]) {
    const portrait=fitScene(width,height,true);
    assert.ok(portrait.width <= width+1e-8 && portrait.height <= height+1e-8);
    const sideways=fitScene(width,height,false,true);
    assert.ok(sideways.height <= width+1e-8 && sideways.width <= height+1e-8);
    assert.equal(sideways.rotation,90);
  }
});
