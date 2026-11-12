import { alignWindowCurtain } from './curtain.js';

// Fit one logical scene uniformly. No element gets an independent screen scale.
export function fitScene(width, height, portrait = false, rotated = false) {
  const logicalWidth = portrait ? 900 : 1600;
  const logicalHeight = portrait ? 1440 : 900;
  const availableWidth = Math.max(1, rotated ? height : width);
  const availableHeight = Math.max(1, rotated ? width : height);
  const scale = Math.min(availableWidth/logicalWidth, availableHeight/logicalHeight);
  return { logicalWidth, logicalHeight, scale, width:logicalWidth*scale, height:logicalHeight*scale, rotation:rotated ? 90 : 0, portrait };
}

export function installViewport({ shell, stage, canvas, rotateButton, exitButton, onLayoutChange }) {
  let layout, frame, wideView = false;
  function update() {
    const portraitScreen = window.innerHeight > window.innerWidth && window.innerWidth <= 900;
    const rotated = wideView && portraitScreen;
    const portrait = portraitScreen && !wideView;
    const box = shell.getBoundingClientRect();
    const next = fitScene(Math.max(1,box.width-2), Math.max(1,box.height-2), portrait, rotated);
    const changed = layout && (layout.portrait !== portrait || layout.rotation !== next.rotation);
    layout = next;
    stage.dataset.layout = portrait ? 'portrait' : 'landscape';
    stage.dataset.viewport = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;
    stage.style.width = `${next.width}px`;
    stage.style.height = `${next.height}px`;
    stage.style.setProperty('--view-rotation',`${next.rotation}deg`);
    canvas.style.width = `${next.logicalWidth}px`;
    canvas.style.height = `${next.logicalHeight}px`;
    canvas.style.setProperty('--scene-scale',next.scale);
    alignWindowCurtain(canvas.querySelector('.room-plane'));
    rotateButton.setAttribute('aria-pressed',String(wideView));
    exitButton.hidden = !wideView;
    if (changed) onLayoutChange?.();
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
  function setWide(value) {
    wideView = value;
    document.body.classList.toggle('wide-view',value);
    update();
    if (value) exitButton.focus({preventScroll:true}); else rotateButton.focus({preventScroll:true});
  }
  rotateButton.addEventListener('click',() => setWide(!wideView));
  exitButton.addEventListener('click',() => setWide(false));
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && wideView) { event.preventDefault(); setWide(false); } });
  new ResizeObserver(schedule).observe(shell);
  window.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('resize',schedule);
  document.addEventListener('fullscreenchange',schedule);
  update();
  return {
    get scale() { return layout.scale; },
    scaleBetween(source,target) { return layout.rotation ? source.height/target.height : source.width/target.width; },
    // Undo the outer scale AND the optional 90-degree viewing rotation.
    delta(dx,dy) { return layout.rotation ? {x:dy/layout.scale,y:-dx/layout.scale} : {x:dx/layout.scale,y:dy/layout.scale}; },
  };
}
