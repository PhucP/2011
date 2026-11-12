import test from 'node:test';
import assert from 'node:assert/strict';
import { curtainProjection,curtainSource,windowAnchors } from '../src/curtain.js';

test('Both rod ends and both hem anchors remain attached to the painted window at every layout size',()=>{
  for (const [width,height] of [[1600,900],[900,506.25],[1024,576]]) {
    const {homography:h}=curtainProjection(width,height);
    curtainSource.forEach(([x,y],i)=>{
      const divisor=h[6]*x+h[7]*y+1;
      const u=(h[0]*x+h[1]*y+h[2])/divisor;
      const v=(h[3]*x+h[4]*y+h[5])/divisor;
      assert.ok(Math.abs(u-windowAnchors[i][0]*width/1672)<1e-7);
      assert.ok(Math.abs(v-windowAnchors[i][1]*height/942)<1e-7);
    });
  }
});
