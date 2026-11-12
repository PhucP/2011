export function bezierPoint(points,t) {
  // De Casteljau: the same evaluator handles cubic and fifth-degree curves.
  const work=points.map(p=>({...p}));
  for(let count=work.length-1;count>0;count--) for(let i=0;i<count;i++) {
    work[i].x+=(work[i+1].x-work[i].x)*t;
    work[i].y+=(work[i+1].y-work[i].y)*t;
  }
  return work[0];
}

export function flowerRoute(start,end,width,height,variant=0) {
  const dx=end.x-start.x,dy=end.y-start.y,distance=Math.hypot(dx,dy);
  const nx=distance?-dy/distance:0,ny=distance?dx/distance:1;
  const short=distance<Math.max(220,Math.min(400,Math.min(width,height)*.5));
  const bend=short?Math.min(42,distance*.16):Math.min(90,distance*.2);
  const sign=variant%2?1:-1;
  // Vary pivot positions independently of the petal animation, without loops.
  const noise=offset=>{const n=Math.sin((variant+1)*12.9898+offset*78.233)*43758.5453;return n-Math.floor(n);};
  const shapes=[
    [[.12,.8],[.36,1.2],[.7,-.8],[.92,-.4]],
    [[.1,.4],[.3,-1],[.7,.8],[.92,.35]],
    [[.13,1],[.4,-.65],[.68,.6],[.91,-.7]],
    [[.12,-.5],[.32,1.1],[.74,.75],[.92,-.6]],
  ];
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const pivots=short?[[.2+noise(1)*.15,.6+noise(2)*.4],[.64+noise(3)*.18,.3+noise(4)*.6]]:shapes[variant%shapes.length];
  const controls=pivots.map(([along,across],i)=>{
    const pivot=short?along:along+(noise(i+5)-.5)*.07;
    const curve=across*(.8+noise(i+9)*.35);
    return {x:clamp(start.x+dx*pivot+nx*bend*curve*sign,12,width-12),
      y:clamp(start.y+dy*pivot+ny*bend*curve*sign,12,height-12)};
  });
  return [start,...controls,end];
}

export function createFlowerCursor() {
  const element=document.createElement('span');element.className='demo-cursor';element.hidden=true;
  element.setAttribute('aria-hidden','true');
  element.innerHTML=`<svg viewBox="0 0 24 24"><defs><radialGradient id="demo-sakura"><stop stop-color="#f5b8cc"/><stop offset="1" stop-color="#ffe7ed"/></radialGradient></defs><g fill="url(#demo-sakura)" stroke="#d994ae" stroke-width=".55">${[0,72,144,216,288].map(angle=>`<ellipse cx="12" cy="6.5" rx="3.4" ry="5" transform="rotate(${angle} 12 12)"/>`).join('')}</g><g stroke="#cf829e" stroke-width=".5">${[0,72,144,216,288].map(angle=>`<path d="M12 12V8.2" transform="rotate(${angle} 12 12)"/>`).join('')}</g><circle cx="12" cy="12" r="1.7" fill="#e5a5b7"/></svg>`;
  document.body.append(element);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const petals=new Set();let frame=0,flight=null,target=null,point=null,anchor=null,idleAt=0,lastAt=0,lastPetal=0,turn=0,routeIndex=0;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function center(el) {
    const box=el?.getBoundingClientRect();
    if(!box || !box.width || !box.height) return null;
    return {x:clamp(box.x+box.width/2,12,innerWidth-12),y:clamp(box.y+box.height/2,12,innerHeight-12)};
  }
  function petal(now) {
    if(reduced.matches || now-lastPetal<(flight?170:420) || petals.size>=12) return;
    lastPetal=now;
    const leaf=document.createElement('i');leaf.className='demo-petal';
    leaf.style.left=`${point.x}px`;leaf.style.top=`${point.y}px`;
    document.body.append(leaf);petals.add(leaf);
    const sway=(turn++%2?1:-1)*(8+Math.random()*9);
    const animation=leaf.animate([
      {transform:'translate(-50%,-50%) rotate(0deg)',opacity:0},
      {transform:`translate(${sway*.25}px,6px) rotate(30deg)`,opacity:.65,offset:.2},
      {transform:`translate(${sway}px,${24+Math.random()*16}px) rotate(140deg)`,opacity:0},
    ],{duration:1400+Math.random()*600,easing:'ease-out'});
    animation.finished.catch(()=>{}).finally(()=>{leaf.remove();petals.delete(leaf);});
  }
  function tick(now) {
    const dt=Math.min(60,now-(lastAt||now));lastAt=now;
    if(flight) {
      const f=flight,t=clamp((now-f.at)/f.duration,0,1),smooth=t*t*(3-2*t);
      point=bezierPoint(f.points,smooth);
      if(t===1) {flight=null;anchor={...point};idleAt=now;f.cleanup();f.resolve();}
    } else {
      const next=center(target);
      if(next) {
        const gain=1-Math.exp(-dt/140);
        anchor.x+=(next.x-anchor.x)*gain;anchor.y+=(next.y-anchor.y)*gain;
      }
      const time=(now-idleAt)/1000;
      point={x:anchor.x+(reduced.matches?0:4*Math.sin(time*1.7)),y:anchor.y+(reduced.matches?0:3*Math.sin(time*2.3))};
    }
    element.style.transform=`translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%)`;
    petal(now);frame=requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(frame);frame=0;lastAt=0;target=null;
    if(flight){const f=flight;flight=null;f.cleanup();f.reject(new DOMException('Stopped','AbortError'));}
    point=null;anchor=null;element.hidden=true;
    for(const leaf of petals){leaf.getAnimations().forEach(a=>a.cancel());leaf.remove();}petals.clear();
  }
  function flyTo(el,signal) {
    signal.throwIfAborted();target=el;
    const end=center(el);if(!end) return Promise.resolve();
    if(!point)point={x:innerWidth*.5,y:Math.min(innerHeight-25,end.y+100)};
    const points=flowerRoute({...point},end,innerWidth,innerHeight,routeIndex++);
    // Estimate actual curve length so a more winding route does not rush past.
    let length=0,previous=points[0];
    for(let i=1;i<=24;i++) {
      const p=bezierPoint(points,i/24);length+=Math.hypot(p.x-previous.x,p.y-previous.y);previous=p;
    }
    element.style.transform=`translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%)`;
    element.hidden=false;
    return new Promise((resolve,reject)=>{
      const abort=()=>{if(flight?.reject===reject){flight=null;anchor={...point};idleAt=performance.now();}reject(new DOMException('Stopped','AbortError'));};
      signal.addEventListener('abort',abort,{once:true});
      flight={points,at:performance.now(),
        duration:reduced.matches?80:clamp(400+length*1.05,450,1800),resolve,reject,
        cleanup:()=>signal.removeEventListener('abort',abort)};
      if(!frame)frame=requestAnimationFrame(tick);
    });
  }
  return {element,flyTo,stop};
}


