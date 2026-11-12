import { memories, dedication } from './content.js';
import { photoOrder, chapters } from './journey.js';
import { photoMotion } from './motion.js';
import { installViewport } from './viewport.js';
import { artworks, installArtboard } from './artboard.js';
import { installDemo } from './demo.js';

const $ = id => document.getElementById(id);
const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let scene = 'intro', generation = 0, order = [], position = 0, turning = false;
const timers = new Set();
const viewport = installViewport({
  shell:$('stage-shell'), stage:$('stage'), canvas:$('scene-canvas'),
  rotateButton:$('rotate'), exitButton:$('rotate-exit'),
  onLayoutChange() {
    // A composition change snaps transient flights to their new logical anchors.
    for (const id of ['floating-envelope','memory-layout','memory-photo','video-scene']) {
      $(id).getAnimations().filter(animation => !('animationName' in animation)).forEach(animation => animation.cancel());
    }
  },
});
const descriptions = {
  intro: ['MỞ MÀN TRI ÂN', 'Dành một chút thời gian, trở về một miền thương nhớ.'],
  revealing: ['VÉN MÀN KÝ ỨC', 'Đâu đó, một lớp học vẫn chờ ta trở về.'],
  classroom: ['LỚP HỌC NĂM ẤY', 'Chạm vào phong thư đang tỏa sáng trên bàn giáo viên.'],
  flying: ['LÁ THƯ THƯƠNG MẾN', 'Có những điều thương mến vẫn luôn ở đây.'],
  letter: ['LÁ THƯ THƯƠNG MẾN', 'Chạm vào phong thư hoặc dấu sáp để mở thư.'],
  opening: ['MỞ NHỮNG KỶ NIỆM', 'Từng mảnh ký ức đang trở về...'],
  gallery: ['MỞ NHỮNG KỶ NIỆM', 'Chọn một bức ảnh để bắt đầu hành trình.'],
  memory: ['NHỮNG LỜI TRI ÂN', 'Mỗi bức ảnh, một lời cảm ơn chưa bao giờ là đủ.'],
  artboard: ['TỪ TRÁI TIM HỌC TRÒ', 'Chạm vào một bức tranh trên bảng ghim để xem thật gần.'],
  video: ['THƯỚC PHIM CÒN MÃI', 'Có những khoảnh khắc sẽ luôn ở lại trong tim.'],
  closing: ['HẸN MỘT MÙA NHỚ', 'Khép lại lá thư. Giữ lại yêu thương.'],
};
function announce(text) { $('status').textContent = text; }
function show(id, visible) { $(id).hidden = !visible; $(id).inert = !visible; }
function focus(id) { requestAnimationFrame(() => $(id)?.focus({ preventScroll: true })); }
function wait(ms, token = generation) {
  return new Promise(resolve => {
    const timer = setTimeout(() => { timers.delete(timer); resolve(token === generation); }, reduced.matches ? Math.min(40, ms) : ms);
    timers.add(timer);
  });
}
function setScene(next) {
  scene = next; body.dataset.scene = next;
  const chapter = chapters[next];
  document.querySelectorAll('[data-chapter]').forEach(el => {
    const active = Number(el.dataset.chapter) === chapter;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  $('scene-tag').innerHTML = `${String(chapter + 1).padStart(2, '0')} <span>/</span> ${descriptions[next][0]}`;
  $('footer-caption').textContent = descriptions[next][1];
  body.classList.toggle('world-dimmed', ['memory','video'].includes(next));
  $('scene-tag').style.color = ['memory','video'].includes(next) ? '#9a8868' : '';
}

// A newly generated painting replaces the previous project's SVG completely.
// Ambient cutouts and the clock share this painting's coordinate plane.

// Ambient dust and leaves are deterministic, inexpensive DOM layers.
for (let i = 0; i < 33; i++) {
  const mote = document.createElement('i');
  mote.className = `mote${i > 27 ? ' petal' : ''}`;
  mote.style.cssText = `left:${5 + (i * 29 % 82)}%;top:${15 + (i * 13 % 76)}%;--duration:${i > 27 ? 14 : 9 + i % 8}s;--delay:-${i * 1.7}s`;
  $('atmosphere').append(mote);
}

// Light original chimes. Created only after an explicit sound-button interaction.
let audio = null, soundEnabled = false, musicTimer = null, beat = 0, demoSilent = false;
function chime(notes = [72, 76, 79], gain = .045) {
  if (demoSilent || !audio || !soundEnabled || audio.state !== 'running') return;
  notes.forEach((note, index) => {
    const oscillator = audio.createOscillator(), envelope = audio.createGain();
    const time = audio.currentTime + index * .17;
    oscillator.type = 'sine'; oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    envelope.gain.setValueAtTime(0, time); envelope.gain.linearRampToValueAtTime(gain, time + .02);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + 2.6);
    oscillator.connect(envelope); envelope.connect(audio.destination); oscillator.start(time); oscillator.stop(time + 2.7);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  });
}
async function toggleSound() {
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    soundEnabled = !soundEnabled;
    if (soundEnabled && !demoSilent && !document.hidden && $('video').paused) await audio.resume(); else await audio.suspend();
    body.classList.toggle('sound-enabled', soundEnabled);
    $('sound').setAttribute('aria-pressed', String(soundEnabled));
    $('sound').setAttribute('aria-label', soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh');
    clearInterval(musicTimer);
    if (soundEnabled) {
      chime();
      musicTimer = setInterval(() => {
        if (document.hidden || !$('video').paused || scene === 'video') return;
        const chords = [[60,64,67],[57,60,64],[53,57,60],[55,59,62]];
        chime(chords[beat++ % 4], .018);
      }, 4200);
    }
  } catch { announce('Trình duyệt chưa hỗ trợ âm thanh. Các cảnh vẫn có thể xem bình thường.'); }
}
$('sound').addEventListener('click', toggleSound);

async function start() {
  if (scene !== 'intro') return;
  const token = ++generation;
  setScene('revealing'); $('intro').inert = true;
  body.classList.add('curtains-open');
  chime([60,67,72]);
  if (!await wait(1950, token)) return;
  show('intro', false); setScene('classroom');
  show('desk-letter', true); show('room-heading', true); show('mobile-room-action', true);
  announce('Lớp học đã mở. Nhấn vào phong thư tỏa sáng trên bàn giáo viên.'); focus('desk-letter');
}
$('intro').addEventListener('click', start);
$('stage').addEventListener('click', () => { if (scene === 'intro') start(); });

async function liftLetter() {
  if (scene !== 'classroom') return;
  const token = generation;
  const source = $('desk-letter-plane').getBoundingClientRect();
  show('desk-letter', false); show('room-heading', false); show('mobile-room-action', false);
  setScene('flying'); show('letter-scene', true);
  $('open-envelope').disabled = true; $('seal').disabled = true;
  const envelope = $('floating-envelope');
  const target = envelope.getBoundingClientRect();
  const flight = viewport.delta(source.x + source.width/2 - target.x - target.width/2, source.y + source.height/2 - target.y - target.height/2);
  const shrink = viewport.scaleBetween(source,target);
  if (!reduced.matches) envelope.animate([
    { transform: `translate(calc(-50% + ${flight.x}px),calc(-50% + ${flight.y}px)) rotateX(64deg) rotateZ(-14deg) scale(${shrink})`, opacity:.65 },
    { transform:'translate(-65%,-85%) rotate(6deg) scale(.8)', offset:.55, opacity:1 },
    { transform:'translate(-50%,-50%) rotate(-3deg) scale(1)', opacity:1 },
  ], { duration:1400, easing:'cubic-bezier(.2,.7,.25,1)' });
  chime([67,72,76]);
  if (!await wait(1450, token)) return;
  setScene('letter'); $('open-envelope').disabled = false; $('seal').disabled = false;
  announce('Lá thư đã ở trước mặt bạn. Nhấn dấu sáp hoặc phong thư để mở.'); focus('seal');
}
$('desk-letter').addEventListener('click', liftLetter);
$('mobile-room-action').addEventListener('click', liftLetter);

function createFan() {
  $('fan').replaceChildren();
  // Fan order is independent of the complete memory slideshow.
  // The two central cards are handwritten letters l1 and l7.
  const previews = [
    {memory:0},
    {memory:memories.findIndex(item => item.src === 'media/img_1699.webp')},
    {art:0}, {art:6},
    {memory:memories.findIndex(item => item.src === 'media/img_1705.webp')},
  ];
  previews.forEach((preview,i) => {
    const isLetter = preview.art !== undefined;
    const item = isLetter ? artworks[preview.art] : memories[preview.memory];
    const photo = document.createElement('button'); photo.className = 'fan-photo';
    photo.style.setProperty('--fan-x', `${(i-2)*39}%`);
    photo.style.setProperty('--fan-angle', `${(i-2)*16}deg`);
    photo.style.setProperty('--fan-delay', `${i*.08}s`);
    photo.setAttribute('aria-label', isLetter ? `Mở bức thư học trò ${preview.art+1}` : `Xem ảnh ${preview.memory+1}: ${item.title}`);
    const image = new Image(); image.src = item.src; image.alt = item.caption || item.title;
    if (isLetter) image.className = 'fan-letter-image';
    const label = document.createElement('span'); label.textContent = isLetter ? 'Thư gửi thầy cô' : `Kỷ niệm ${String(preview.memory+1).padStart(2,'0')}`;
    photo.append(image, label); photo.addEventListener('click', () => {
      if (isLetter && scene === 'gallery') showArtboard(preview.art);
      else selectMemory(preview.memory, photo);
    });
    $('fan').append(photo);
  });
  document.querySelector('.gallery-picker')?.remove();
  document.querySelector('.gallery-picker-label')?.remove();
  const label = document.createElement('p'); label.className = 'gallery-picker-label';
  label.textContent = `${memories.length} mảnh ký ức và những lá thư, chọn một điều bạn muốn mở`;
  const picker = document.createElement('div'); picker.className = 'gallery-picker'; picker.setAttribute('aria-label', `Chọn một trong ${memories.length} bức ảnh`);
  memories.forEach((item, i) => {
    const button = document.createElement('button'); button.textContent = String(i+1).padStart(2,'0');
    button.setAttribute('aria-label', `Ảnh ${i+1}: ${item.title}`);
    button.addEventListener('click', () => selectMemory(i, button)); picker.append(button);
  });
  $('letter-scene').append(label, picker);
}
createFan();
function enableGallery(enabled) {
  $('fan').inert = !enabled;
  document.querySelector('.gallery-picker').inert = !enabled;
  document.querySelectorAll('.fan-photo,.gallery-picker>button').forEach(button => { button.disabled = !enabled; });
}
async function openLetter() {
  if (scene !== 'letter') return;
  const token = generation; setScene('opening');
  $('open-envelope').disabled = true; $('seal').disabled = true;
  // The fixed-size pocket never changes shape. Open the hinge before raising cards.
  $('letter-scene').classList.add('envelope-unsealed'); enableGallery(false);
  chime([64,69,72,76]);
  if (!await wait(1050, token)) return;
  $('letter-scene').classList.add('envelope-open');
  if (!await wait(1450, token)) return;
  setScene('gallery'); enableGallery(true);
  $('letter-instruction').querySelector('h2').textContent = 'Mở một mảnh ký ức';
  announce('Thư đã mở. Chọn một ảnh trong xấp ảnh, hoặc dùng 13 nút số bên dưới.');
  focusFan();
}
function focusFan() { requestAnimationFrame(() => $('fan').querySelector('button')?.focus({preventScroll:true})); }
$('seal').addEventListener('click', openLetter);
$('open-envelope').addEventListener('click', openLetter);

async function selectMemory(index, origin) {
  if (scene !== 'gallery') return;
  const source = origin?.getBoundingClientRect();
  order = photoOrder(index, memories.length); position = 0;
  show('letter-scene', false); show('memory-scene', true); setScene('memory');
  renderMemory(source); chime([72,76]);
}
function renderMemory(source) {
  const item = memories[order[position]];
  $('photo').src = item.src; $('photo').alt = item.caption;
  $('photo-caption').textContent = item.caption;
  $('memory-number').textContent = `MẢNH KÝ ỨC ${String(order[position]+1).padStart(2,'0')} · ${position+1} / ${memories.length}`;
  $('memory-title').textContent = item.title;
  $('signature').textContent = '— ' + dedication.signature;
  $('written-lines').replaceChildren(...item.lines.map((text,i) => {
    const line = document.createElement('p'); line.textContent = text; line.style.setProperty('--line',i); return line;
  }));
  $('photo-progress').replaceChildren(...order.map((_,i) => {
    const dot = document.createElement('span'); dot.className = i === position ? 'current' : i < position ? 'passed' : '';
    dot.setAttribute('aria-label', `Ảnh ${i+1}${i === position ? ', đang xem' : ''}`); return dot;
  }));
  $('next').firstChild.textContent = position === order.length-1 ? 'Xem tranh học trò ' : 'Ký ức tiếp theo ';
  // Restart decorative effects on each new photo, including when reduced motion changes.
  for (const el of [$('memory-title'), $('signature'), ...document.querySelectorAll('.photo-flowers')]) {
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }
  const photo = $('memory-photo');
  photo.getAnimations().forEach(animation => animation.cancel());
  const target = photo.getBoundingClientRect();
  const delta = source ? viewport.delta(source.x-target.x,source.y-target.y) : null;
  const origin = source ? { ...delta, scale:Math.max(.15,viewport.scaleBetween(source,target)) } : null;
  const motion = photoMotion(order[position], origin);
  photo.dataset.entrance = motion.name;
  photo.style.setProperty('--photo-tilt',`${motion.tilt}deg`);
  if (!reduced.matches) photo.animate(motion.frames,{duration:motion.duration,easing:'cubic-bezier(.2,.65,.2,1)'});
  announce(`Ảnh ${position+1} trên ${order.length}. ${item.title}. ${item.lines.join(' ')}`);
  focus('memory-title');
  const nextItem = memories[order[position+1]];
  if (nextItem) { const preload = new Image(); preload.src = nextItem.src; }
}
async function nextMemory() {
  if (scene !== 'memory' || turning) return;
  const token = generation; turning = true; $('next').disabled = true;
  if (!reduced.matches) $('memory-layout').animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-35px)'}],{duration:250,fill:'forwards'});
  if (!await wait(260, token)) return;
  $('memory-layout').getAnimations().forEach(a => a.cancel());
  if (position < order.length - 1) {
    position++; renderMemory(); chime([69,76],.025);
  } else showArtboard();
  turning = false; $('next').disabled = false;
}
$('next').addEventListener('click', nextMemory);
function returnToGallery() {
  if (!['memory','artboard','video'].includes(scene)) return;
  artboard.reset(); show('artboard-scene',false);
  generation++; turning = false; $('next').disabled = false;
  pauseVideo();
  show('memory-scene', false); show('video-scene', false); show('letter-scene', true);
  setScene('gallery'); focusFan(); announce('Đã trở về lá thư. Bạn có thể chọn một bức ảnh khác.');
}
$('back-gallery').addEventListener('click', returnToGallery);
$('video-back').textContent = '↶ Trở về bảng tranh';
$('video-back').addEventListener('click', showArtboard);
const artboard = installArtboard({ viewport, reduced });
function showArtboard(artIndex) {
  pauseVideo(); artboard.reset();
  show('memory-scene',false); show('letter-scene',false); show('video-scene',false);
  show('artboard-scene',true); setScene('artboard');
  if (Number.isInteger(artIndex)) artboard.openIndex(artIndex);
  else { artboard.reveal(); focus('artboard-title'); }
  announce('Từ trái tim học trò. Gửi thầy cô kính yêu. Chọn một trong 8 bức tranh để xem.');
}
$('artboard-back').addEventListener('click', returnToGallery);
$('artboard-next').addEventListener('click', showVideo);
function showVideo() {
  artboard.reset(); show('artboard-scene',false);
  show('memory-scene',false); show('letter-scene',false); show('video-scene',true);
  $('video').currentTime = 0; $('video').controls = false;
  show('play',true); show('video-error',false);
  setScene('video'); announce('Nhấn Phát để xem thước phim kỷ niệm cuối cùng.'); focus('play');
}
$('play').addEventListener('click', async () => {
  if (scene !== 'video') return;
  try {
    await $('video').play(); show('play',false); $('video').controls = true;
  } catch { show('video-error',true); announce('Video chưa phát được. Bạn có thể tải video hoặc khép lá thư.'); }
});
$('video').addEventListener('play', () => { if (audio) audio.suspend(); });
$('video').addEventListener('error', () => { if (scene === 'video') show('video-error',true); });
function pauseVideo() {
  $('video').pause();
  if (audio && soundEnabled && !demoSilent && !document.hidden) audio.resume().catch(() => {});
}
async function finish() {
  if (scene !== 'video') return;
  const token = ++generation; setScene('closing'); pauseVideo();
  $('video-scene').inert = true;
  if (!reduced.matches) $('video-scene').animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'translateY(10%) scale(.2)'}],{duration:1250,easing:'ease-in',fill:'forwards'});
  if (!await wait(1250, token)) return;
  show('video-scene',false); $('video-scene').getAnimations().forEach(a => a.cancel());
  show('letter-scene',true); $('letter-scene').inert = true;
  document.querySelector('.gallery-picker').hidden = true; document.querySelector('.gallery-picker-label').hidden = true;
  $('letter-instruction').hidden = true;
  $('letter-scene').classList.remove('envelope-open');
  if (!await wait(950, token)) return;
  $('letter-scene').classList.remove('envelope-unsealed');
  if (!await wait(1450, token)) return;
  const envelope = $('floating-envelope');
  const current = envelope.getBoundingClientRect();
  // Measure the actual desk target so the new illustration and mobile crop agree.
  show('desk-letter',true); $('desk-letter').style.visibility = 'hidden';
  const destination = $('desk-letter-plane').getBoundingClientRect();
  show('desk-letter',false); $('desk-letter').style.visibility = '';
  const {x:dx,y:dy} = viewport.delta(destination.x + destination.width/2 - current.x - current.width/2, destination.y + destination.height/2 - current.y - current.height/2);
  const shrink = viewport.scaleBetween(destination,current);
  if (!reduced.matches) envelope.animate([
    { transform:'translate(-50%,-50%) rotate(-3deg) scale(1)',opacity:1 },
    { transform:'translate(-35%,-85%) rotate(7deg) scale(.65)',offset:.45,opacity:1 },
    { transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotateX(64deg) rotateZ(-14deg) scale(${shrink})`,opacity:.8 },
  ], {duration:2200,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
  if (!await wait(2200, token)) return;
  show('letter-scene',false); show('desk-letter',true); $('desk-letter').inert = true;
  show('closing-message',true); chime([64,67,72]);
  if (!await wait(3000, token)) return;
  show('closing-message',false); body.classList.remove('curtains-open');
  if (!await wait(3000, token)) return;
  reset(); announce('Lá thư đã khép lại. Cảm ơn thầy cô. Chạm vào màn hình để bắt đầu lại.');
}
$('finish').addEventListener('click', finish);
$('video').addEventListener('ended', finish);

function reset() {
  artboard.reset(); show('artboard-scene',false);
  generation++; turning = false;
  // Cancel transitions from any interrupted scene; token checks stop stale async work.
  for (const el of [$('floating-envelope'), $('memory-layout'), $('memory-photo'), $('video-scene')]) el.getAnimations().forEach(a => a.cancel());
  pauseVideo(); $('video').currentTime = 0; $('video').controls = false;
  body.classList.remove('curtains-open');
  for (const id of ['desk-letter','room-heading','mobile-room-action','letter-scene','memory-scene','video-scene','closing-message']) show(id,false);
  $('letter-scene').classList.remove('envelope-open','envelope-unsealed');
  $('open-envelope').disabled = false; $('seal').disabled = false; $('next').disabled = false;
  $('letter-instruction').hidden = false;
  $('letter-instruction').querySelector('h2').textContent = 'Một lá thư, ngàn lời chưa nói';
  document.querySelector('.gallery-picker').hidden = false; document.querySelector('.gallery-picker-label').hidden = false;
  enableGallery(false);
  show('intro',true); setScene('intro'); order = []; position = 0; focus('intro');
}
$('restart').addEventListener('click', () => { reset(); announce('Đã trở về màn mở đầu.'); });
document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); reset(); });
$('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if ($('stage-shell').requestFullscreen) await $('stage-shell').requestFullscreen();
    else announce('Bạn có thể dùng chế độ toàn màn hình của trình duyệt.');
  } catch { announce('Bạn có thể dùng chế độ toàn màn hình của trình duyệt.'); }
});
document.addEventListener('keydown', event => {
  if (event.defaultPrevented) return;
  if (event.target.matches('video,input,textarea')) return;
  if (event.key === 'ArrowRight' && scene === 'memory') { event.preventDefault(); nextMemory(); }
  if (event.key === 'Escape' && ['memory','video'].includes(scene)) returnToGallery();
});
let resumeVideoOnVisible = false;
document.addEventListener('visibilitychange', () => {
  body.classList.toggle('paused',document.hidden);
  if (document.hidden) {
    resumeVideoOnVisible = !$('video').paused;
    $('video').pause(); if (audio) audio.suspend();
  } else {
    if (soundEnabled && !demoSilent && audio && !resumeVideoOnVisible) audio.resume().catch(() => {});
    // Let the viewer choose when to resume the film rather than autoplaying after a tab switch.
    if (resumeVideoOnVisible && scene === 'video') { $('video').controls = true; show('play',true); }
    resumeVideoOnVisible = false;
  }
});
reset();
installDemo({reset,setSceneMuted(muted) {
  demoSilent=muted;
  if(!audio) return;
  if(muted) audio.suspend().catch(()=>{});
  else if(soundEnabled && !document.hidden && $('video').paused) audio.resume().catch(()=>{});
}});
