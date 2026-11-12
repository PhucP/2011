import { createFlowerCursor } from './demo-cursor.js';

export const fanHoverOrder=[1,3,5,4,2,1];
export const artHoverOrder=[1,6,8,3,4,7,2,5];
export const artOpenOrder=[6,3,2,5,4,8,1,7];

export function installDemo({reset,setSceneMuted}) {
  const $=id=>document.getElementById(id);
  const panel=document.createElement('details'); panel.className='demo-panel';
  panel.innerHTML=`<summary>Tự diễn hoạt</summary><div class="demo-settings">
    <strong>Diễn hoạt toàn bộ hành trình</strong>
    <label>Chờ trước mỗi lần nhấn (giây)<input id="demo-click" type="number" min="0" max="30" step="0.1" value="1.2"></label>
    <label>Giữ hover (giây)<input id="demo-hover" type="number" min="0.2" max="30" step="0.1" value="0.9"></label>
    <label>Dừng xem mỗi ảnh (giây)<input id="demo-photo" type="number" min="0" max="60" step="0.5" value="3"></label>
    <label>Dừng xem mỗi tranh (giây)<input id="demo-art" type="number" min="0" max="60" step="0.5" value="3"></label>
    <div class="demo-actions"><button id="demo-start">Bắt đầu từ cảnh rèm</button><button id="demo-stop" disabled>Dừng</button></div>
    <p id="demo-status" role="status">Dùng cùng nút và hiệu ứng với thao tác thủ công.</p>
    <small>Scene không phát âm thanh; chỉ video cuối có tiếng. Nhấn Esc hoặc chạm vào trang để dừng.</small>
  </div>`;
  document.body.append(panel);
  const fullscreenPrompt=document.createElement('button');
  fullscreenPrompt.className='demo-fullscreen-prompt'; fullscreenPrompt.hidden=true;
  fullscreenPrompt.textContent='Vào toàn màn hình';
  fullscreenPrompt.title='Trình duyệt yêu cầu nhấn một lần để cho phép toàn màn hình';
  document.body.append(fullscreenPrompt);
  async function enterFullscreen() {
    // Fullscreen the root so the flower, petals and controls remain visible.
    if(!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch { /* URL auto-start can lack a user gesture. */ }
    }
    const native=!!document.fullscreenElement;
    document.body.classList.toggle('demo-window-fullscreen',!native);
    fullscreenPrompt.hidden=native || !document.documentElement.requestFullscreen;
  }
  fullscreenPrompt.addEventListener('click',enterFullscreen);
  document.addEventListener('fullscreenchange',()=>{
    if(document.fullscreenElement) {
      document.body.classList.remove('demo-window-fullscreen');fullscreenPrompt.hidden=true;
    } else if(controller) {
      stop();status('Đã dừng diễn hoạt khi thoát toàn màn hình.');
    }
  });
  const flower=createFlowerCursor(),cursor=flower.element;
  let controller=null, hovered=null;
  const status=text=>$('demo-status').textContent=text;
  const seconds=id=>Math.max(id==='hover' ? .2 : 0,Math.min(60,Number($(`demo-${id}`).value)||0))*1000;
  function clearHover() {hovered?.classList.remove('demo-hover');hovered=null;}
  function stop(exitFullscreen=false) {
    controller?.abort(); controller=null;clearHover();flower.stop();cursor.classList.remove('demo-clicking');
    document.body.classList.remove('demo-window-fullscreen');fullscreenPrompt.hidden=true;
    document.body.classList.remove('demo-running');setSceneMuted(false);
    $('demo-start').disabled=false;$('demo-stop').disabled=true;
    if(exitFullscreen && document.documentElement.matches(':fullscreen')) document.exitFullscreen().catch(()=>{});
  }
  function sleep(ms,signal) {
    return new Promise((resolve,reject)=>{
      if(signal.aborted) return reject(new DOMException('Stopped','AbortError'));
      const abort=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};
      const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);
      signal.addEventListener('abort',abort,{once:true});
    });
  }
  async function until(predicate,signal,timeout=90000) {
    const start=performance.now();
    while(!predicate()) {
      if(performance.now()-start>timeout) throw new Error('Cảnh chưa sẵn sàng. Hãy kiểm tra tài nguyên và chạy lại.');
      await sleep(60,signal);
    }
    signal.throwIfAborted();
  }
  async function settle(root,signal) {
    // Infinite ambient motions continue; finite scene transitions must finish.
    await sleep(50,signal);
    await until(()=>!root.getAnimations({subtree:true}).some(a=>a.playState==='running' && a.effect?.getTiming().iterations!==Infinity),signal);
  }
  function ready(el) {return el && el.getClientRects().length && !el.disabled && !el.closest('[inert]');}
  async function hover(el,signal) {
    await until(()=>ready(el),signal);
    if(hovered===el && el.classList.contains('demo-hover')) return;
    clearHover();
    el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    await flower.flyTo(el,signal);
    hovered=el;el.classList.add('demo-hover');
    await sleep(seconds('hover'),signal);
  }
  async function click(el,signal) {
    await sleep(seconds('click'),signal);await hover(el,signal);
    signal.throwIfAborted();
    cursor.classList.add('demo-clicking');el.click();
    await sleep(160,signal);cursor.classList.remove('demo-clicking');clearHover();
  }
  async function run() {
    stop(); const local=new AbortController();controller=local;const signal=local.signal;
    const video=$('video'), muted=video.muted;
    $('demo-start').disabled=true;$('demo-stop').disabled=false;panel.open=false;
    document.body.classList.add('demo-running');setSceneMuted(true);
    try {
      await enterFullscreen(); signal.throwIfAborted();
      reset(); status('Đang diễn hoạt cảnh rèm…');
      await settle($('intro-decoration'),signal);
      await click($('intro'),signal);
      await until(()=>document.body.dataset.scene==='classroom',signal);
      await click($('desk-letter'),signal);
      await until(()=>document.body.dataset.scene==='letter',signal);
      await click($('seal'),signal);
      await until(()=>document.body.dataset.scene==='gallery',signal);
      await settle($('floating-envelope'),signal);
      status('Hover thumbnail: 1 → 3 → 5 → 4 → 2 → 1');
      const fan=[...document.querySelectorAll('.fan-photo')];
      for(const number of fanHoverOrder) await hover(fan[number-1],signal);
      await click(fan[0],signal);
      await until(()=>document.body.dataset.scene==='memory',signal);
      while(document.body.dataset.scene==='memory') {
        await until(()=>!$('next').disabled,signal);await settle($('memory-scene'),signal);
        status(`Đang xem ${$('memory-number').textContent}`);
        await sleep(seconds('photo'),signal);await click($('next'),signal);
        await until(()=>!$('next').disabled || document.body.dataset.scene!=='memory',signal);
      }
      await until(()=>document.body.dataset.scene==='artboard',signal);
      await settle($('pinboard'),signal);
      const cards=[...document.querySelectorAll('.pinned-art')];
      status('Hover tranh: 1 → 6 → 8 → 3 → 4 → 7 → 2 → 5');
      for(const number of artHoverOrder) await hover(cards[number-1],signal);
      for(const number of artOpenOrder) {
        status(`Đang mở tranh ${number}`);await click(cards[number-1],signal);
        await until(()=>!$('art-viewer').hidden && $('art-viewer').dataset.busy==='false',signal);
        await sleep(seconds('art'),signal);await click($('art-close'),signal);
        await until(()=>$('art-viewer').hidden,signal);
      }
      await click($('artboard-next'),signal);
      await until(()=>document.body.dataset.scene==='video',signal);
      video.muted=false;
      status('Đang phát video và chờ phần khép màn…');
      await click($('play'),signal);
      await until(()=>!video.paused || document.body.dataset.scene==='closing' || !$('video-error').hidden,signal);
      if(!$('video-error').hidden) {
        panel.open=true;
        throw new Error('Trình duyệt yêu cầu nhấn Phát để phát video có âm thanh.');
      }
      await until(()=>document.body.dataset.scene==='intro',signal,Math.max(120000,(video.duration||10)*1000+60000));
      status('Đã diễn hoạt trọn hành trình.');
    } catch(error) {
      status(error.name==='AbortError'?'Đã dừng. Bạn có thể tiếp tục thao tác thủ công.':error.message);
    } finally {
      video.muted=muted;
      if(controller===local) stop();
    }
  }
  $('demo-start').addEventListener('click',run);
  $('demo-stop').addEventListener('click',()=>{stop(true);status('Đã dừng diễn hoạt.');});
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && controller){stop(true);status('Đã dừng diễn hoạt.');}},true);
  document.addEventListener('pointerdown',event=>{
    if(controller && event.isTrusted && !panel.contains(event.target) && event.target!==fullscreenPrompt){stop(true);status('Đã dừng để thao tác thủ công.');}
  },true);
  const params=new URLSearchParams(location.search);
  for(const id of ['click','hover','photo','art']) {
    const value=params.get(id);if(value!==null && Number.isFinite(Number(value))) $(`demo-${id}`).value=String(Math.max(id==='hover' ? .2 : 0,Math.min(60,Number(value))));
  }
  if(params.get('demo')==='1') run();
}
