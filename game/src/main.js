// Dapur Senja — boot and game loop. A fixed 1280x720 logical field scaled
// to the window; the simulation steps at a fixed rate whatever the display's
// rate. With ?shot=cover|play|serve|rush the page stages one deterministic
// scene, draws it once and raises window.__shotReady for the screenshot
// harness; without it, it plays.

import { FIELD, STEP } from './config.js';
import { World } from './world.js';
import { render } from './render.js';
import { clickAt, keyDown } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || '1') || 1;

const world = new World(seed);
let visualTime = 0;
// Debug handle for play-testing (read-only inspection of the live state).
window.__world = world;

function fitCanvas() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.width = Math.round(FIELD.width * scale);
  canvas.height = Math.round(FIELD.height * scale);
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

window.addEventListener('resize', fitCanvas);
fitCanvas();

function draw() {
  render(ctx, world.state, visualTime);
}

function announce() {
  const s = world.state;
  if (!status) return;
  status.textContent = s.screen === 'play'
    ? `Dapur Senja: ${s.served} hidangan tersaji, ${s.money} rupiah, ${Math.ceil(s.shiftLeft)} detik lagi`
    : s.screen === 'over'
      ? `Shift selesai: ${s.served} hidangan, ${s.money} rupiah`
      : 'Dapur Senja: tekan Enter untuk mulai shift';
}

if (shot) {
  // Screenshot mode: stage the scene, draw it once, signal readiness.
  const staged = stageShot(shot, world);
  visualTime = world.state.time;
  draw();
  announce();
  window.__shotReady = true;
  window.__shotBest = staged.best;
} else {
  // Play mode: fixed-step simulation with requestAnimationFrame.
  let last = performance.now();
  let acc = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    visualTime += dt;
    acc += dt;
    while (acc >= STEP) {
      world.step(STEP);
      acc -= STEP;
    }
    draw();
    announce();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * FIELD.width;
    const y = ((event.clientY - rect.top) / rect.height) * FIELD.height;
    clickAt(world, x, y);
  });
  window.addEventListener('keydown', (event) => {
    if (keyDown(world, event.key)) event.preventDefault();
  });
}
