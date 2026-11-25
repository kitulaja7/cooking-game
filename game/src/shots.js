// Dapur Senja — the screenshot scenes behind ?shot=cover|play|serve|rush.
// Each scene is a fixed, reachable game state (seeded, no randomness at
// render time), drawn by the game's own renderer: the frame is what a real
// shift really looks like at that moment, and the same seed always gives
// the same frame. The cover shows every criterion-1 element at once:
// order board, ingredients on the counter, a dish mid-assembly (wok +
// talenan), the big timer and a finished plate ready to serve.

import { STEP } from './config.js';

/** Apply a literal state snapshot onto `world` (all values reachable in play). */
function stage(world, snap) {
  const s = world.state;
  s.screen = 'play';
  s.time = snap.time;
  s.shiftLeft = snap.shiftLeft;
  s.level = snap.level;
  s.money = snap.money;
  s.score = snap.money;
  s.combo = snap.combo;
  s.bestCombo = snap.bestCombo;
  s.served = snap.served;
  s.lost = snap.lost;
  s.orders = snap.orders;
  s.hand = snap.hand ?? null;
  s.board = snap.board ?? null;
  s.wok = snap.wok ?? null;
  s.plate = snap.plate ?? [];
  s.readyDish = snap.readyDish ?? null;
  s.toast = snap.toast ?? null;
  s.serveFlash = snap.serveFlash ?? 0;
  return { screen: 'play', best: s.money };
}

const ORDER = (recipeId, timeLeft, maxTime) => ({ recipeId, timeLeft, maxTime, born: 0 });

export function stageCover(world) {
  world.reset(7);
  return stage(world, {
    time: 65, shiftLeft: 115, level: 2,
    money: 86000, combo: 3, bestCombo: 4, served: 5, lost: 1,
    orders: [ORDER('nasi-goreng', 20, 48), ORDER('mie-ayam', 34, 48), ORDER('ayam-geprek', 41, 48)],
    plate: ['nasi', 'telur', 'ayam', 'sambal'],
    readyDish: 'nasi-goreng',
    wok: { ing: 'mie', progress: 0.55 },
    board: { ing: 'sayur', clicks: 2 },
    toast: { text: '+Rp 18.000   KOMBO x3!', color: '#4e9b47', t: 1.8 },
  });
}

export function stagePlay(world) {
  world.reset(3);
  return stage(world, {
    time: 28, shiftLeft: 152, level: 1,
    money: 34000, combo: 1, bestCombo: 2, served: 2, lost: 0,
    orders: [ORDER('mie-ayam', 30, 48), ORDER('soto-ayam', 38, 48), null],
    plate: ['nasi', 'telur'],
    readyDish: null,
    wok: { ing: 'ayam', progress: 0.8 },
    board: null,
    hand: { ing: 'sambal', stage: 'raw' },
    toast: null,
  });
}

export function stageServe(world) {
  world.reset(11);
  return stage(world, {
    time: 96, shiftLeft: 84, level: 3,
    money: 142000, combo: 4, bestCombo: 5, served: 8, lost: 1,
    orders: [ORDER('ayam-geprek', 18, 44), ORDER('soto-ayam', 30, 44), ORDER('mie-ayam', 36, 44)],
    plate: ['ayam', 'sambal', 'nasi'],
    readyDish: 'ayam-geprek',
    wok: null,
    board: null,
    hand: null,
    toast: { text: '+Rp 20.000   KOMBO x4!', color: '#4e9b47', t: 1.8 },
    serveFlash: 0.4,
  });
}

export function stageRush(world) {
  world.reset(5);
  return stage(world, {
    time: 150, shiftLeft: 30, level: 4,
    money: 214000, combo: 2, bestCombo: 6, served: 12, lost: 2,
    orders: [ORDER('nasi-goreng', 8, 36), ORDER('mie-ayam', 12, 36), ORDER('soto-ayam', 6, 36)],
    plate: ['mie'],
    readyDish: null,
    wok: { ing: 'ayam', progress: 0.35 },
    board: { ing: 'sayur', clicks: 1 },
    hand: { ing: 'telur', stage: 'raw' },
    toast: { text: 'RUSH! PESANAN MENUMPUK', color: '#d94f3d', t: 1.8 },
  });
}

/** Set `world` to the named scene (cover, play, serve or rush; anything else
 *  is cover) and return the screen to draw and the best score to show. */
export function stageShot(name, world) {
  if (name === 'play') return stagePlay(world);
  if (name === 'serve') return stageServe(world);
  if (name === 'rush') return stageRush(world);
  return stageCover(world);
}
