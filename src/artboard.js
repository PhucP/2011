export const artworks = Array.from({length:8}, (_,i) => ({
  src:`media/letters/l${i+1}.webp`, thumbnail:`media/letters/thumbs/l${i+1}.webp`,
  title:`Nét vẽ yêu thương ${String(i+1).padStart(2,'0')}`,
}));

export function installArtboard({viewport,reduced}) {
  const $ = id => document.getElementById(id);
  const board=$('pinboard'), viewer=$('art-viewer'), enlarged=$('art-enlarged');
  let selected=null, busy=false, revision=0;
  const cards=artworks.map((art,i) => {
    const card=document.createElement('button'); card.className='pinned-art';
    card.style.setProperty('--tilt',`${[-10,7,-6,10,8,-9,5,-7][i]}deg`);
    card.setAttribute('aria-label',`Xem tranh ${i+1}: ${art.title}`);
    const pin=document.createElement('span'); pin.className='drawing-pin'; pin.setAttribute('aria-hidden','true');
    const image=new Image(); image.src=art.thumbnail; image.alt=art.title; image.decoding='async';
    image.onload=()=>card.style.setProperty('--drawing-ratio',image.naturalWidth/image.naturalHeight);
    const caption=document.createElement('span'); caption.className='pinned-caption'; caption.textContent=art.title;
    card.append(pin,image,caption); card.addEventListener('click',()=>open(card,art,i)); board.append(card); return card;
  });
  function reset() {
    revision++; busy=false;
    enlarged.getAnimations().forEach(a=>a.cancel());
    cards.forEach(card=>{card.style.visibility='';card.getAnimations().forEach(a=>a.cancel());});
    viewer.hidden=true; $('artboard-content').inert=false;
    $('artboard-scene').classList.remove('art-viewing'); selected=null;
  }
  function origin(card) {
    const from=card.getBoundingClientRect(), to=enlarged.getBoundingClientRect();
    const delta=viewport.delta(from.x+from.width/2-to.x-to.width/2,from.y+from.height/2-to.y-to.height/2);
    return `translate(${delta.x}px,${delta.y}px) rotate(${card.style.getPropertyValue('--tilt')}) scale(${viewport.scaleBetween(from,to)})`;
  }
  async function animate(frames,duration,token) {
    if (!reduced.matches) {
      const animation=enlarged.animate(frames,{duration,easing:'cubic-bezier(.2,.75,.25,1)'});
      try { await animation.finished; } catch { /* Reset or resize can interrupt a flight. */ }
    }
    return token===revision;
  }
  async function open(card,art,index) {
    if (selected || busy) return;
    const token=++revision; busy=true; selected=card;
    const thumb=card.querySelector('img');
    enlarged.style.setProperty('--art-ratio', thumb.naturalWidth && thumb.naturalHeight ? thumb.naturalWidth/thumb.naturalHeight : .75);
    // Show the loaded thumbnail immediately, then replace with the original for detail.
    $('art-full').src=art.thumbnail; $('art-full').alt=`Tranh học sinh ${index+1}: ${art.title}`;
    const full=new Image(); full.src=art.src;
    full.onload=()=>{if(token===revision) $('art-full').src=art.src;};
    $('art-viewer-caption').textContent=art.title;
    viewer.dataset.busy='true';
    viewer.hidden=false; $('artboard-content').inert=true;
    const start=origin(card); card.style.visibility='hidden';
    $('artboard-scene').classList.add('art-viewing'); $('art-close').focus({preventScroll:true});
    if (!await animate([{transform:start,opacity:.65},{transform:'none',opacity:1}],720,token)) return;
    busy=false; viewer.dataset.busy='false';
  }
  async function close() {
    if (!selected || busy) return;
    const token=revision, card=selected; busy=true;
    $('artboard-scene').classList.remove('art-viewing');
    if (!await animate([{transform:'none',opacity:1},{transform:origin(card),opacity:.6}],550,token)) return;
    reset(); card.focus({preventScroll:true});
  }
  $('art-close').addEventListener('click',close); $('art-backdrop').addEventListener('click',close);
  viewer.addEventListener('keydown',event=>{
    if(event.key==='Escape') {event.preventDefault();event.stopPropagation();close();}
    if(event.key==='Tab') {
      event.preventDefault();
      (document.activeElement===$('art-close') ? $('art-backdrop') : $('art-close')).focus({preventScroll:true});
    }
  });
  return {reset,openIndex(index) {
    if (cards[index]) open(cards[index],artworks[index],index);
  },reveal() {
    if(reduced.matches) return;
    cards.forEach((card,i)=>card.animate([
      {opacity:0,transform:'translateY(calc(-50% + 35px)) rotate(0deg) scale(.9)'},
      {opacity:1,transform:`translateY(-50%) rotate(${card.style.getPropertyValue('--tilt')})`},
    ],{duration:650,delay:i*70,fill:'backwards',easing:'cubic-bezier(.2,.7,.25,1)'}));
  }};
}
