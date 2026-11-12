import test from 'node:test';
import assert from 'node:assert/strict';
import { bezierPoint, flowerRoute } from '../src/demo-cursor.js';

test('Cursor curve reaches both anchors and bows away from the straight segment',()=>{
  const a={x:10,y:20},b={x:200,y:20},c1={x:50,y:100},c2={x:150,y:100};
  assert.deepEqual(bezierPoint([a,c1,c2,b],0),a);
  assert.deepEqual(bezierPoint([a,c1,c2,b],1),b);
  assert.ok(bezierPoint([a,c1,c2,b],.5).y>60);
});
test('Cursor path remains inside the viewport when all control points are inside',()=>{
  const anchors=[{x:12,y:12},{x:200,y:800},{x:370,y:30},{x:360,y:820}];
  for(let i=0;i<=100;i++) {
    const p=bezierPoint(anchors,i/100);
    assert.ok(p.x>=12-1e-8&&p.x<=370+1e-8&&p.y>=12-1e-8&&p.y<=820+1e-8);
  }
});

test('Fifth-degree routes vary their curvature and remain bounded at phone and laptop sizes',()=>{
  for(const [width,height] of [[390,844],[1366,768]]) {
    const start={x:40,y:height/2},end={x:width-40,y:height/2};
    const routes=Array.from({length:4},(_,i)=>flowerRoute(start,end,width,height,i));
    assert.equal(new Set(routes.map(r=>JSON.stringify(r))).size,4);
    for(const route of routes) {
      assert.equal(route.length,6);
      assert.deepEqual(bezierPoint(route,0),start);
      assert.deepEqual(bezierPoint(route,1),end);
      const ys=[];
      for(let i=0;i<=100;i++) {
        const p=bezierPoint(route,i/100);ys.push(p.y-start.y);
        assert.ok(p.x>=12-1e-8&&p.x<=width-12+1e-8&&p.y>=12-1e-8&&p.y<=height-12+1e-8);
      }
      assert.ok(Math.max(...ys)-Math.min(...ys)>1);
    }
  }
});

test('Short hops use cubic curves with gentle bends and changing pivots',()=>{
  const start={x:100,y:200},end={x:240,y:200};
  const routes=Array.from({length:8},(_,i)=>flowerRoute(start,end,1366,768,i));
  assert.equal(new Set(routes.map(r=>JSON.stringify(r))).size,8);
  for(const route of routes) {
    assert.equal(route.length,4);
    assert.deepEqual(bezierPoint(route,0),start);
    assert.deepEqual(bezierPoint(route,1),end);
    for(let i=0;i<=100;i++) {
      const p=bezierPoint(route,i/100);
      assert.ok(Math.abs(p.y-start.y)<24);
      assert.ok(p.x>=start.x-1e-8&&p.x<=end.x+1e-8);
    }
  }
});
