// Dapur Senja — input. Mouse clicks and keyboard both drive the same world
// actions, so the game is fully playable either way. Click targets are the
// layout rects from config.js: bins, talenan, wok, plate, order tickets and
// the serve window.

import { LAYOUT, ticketRect, binRect } from './config.js';
import { INGREDIENTS } from './recipes.js';

function inside(x, y, r) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

/** What lives at logical point (x, y): { kind, index?, id? } or null. */
export function hitAt(x, y) {
  for (let i = 0; i < INGREDIENTS.length; i += 1) {
    if (inside(x, y, binRect(i))) return { kind: 'bin', id: INGREDIENTS[i].id };
  }
  if (inside(x, y, LAYOUT.boardStation)) return { kind: 'board' };
  if (inside(x, y, LAYOUT.wokStation)) return { kind: 'wok' };
  if (inside(x, y, LAYOUT.plateStation)) return { kind: 'plate' };
  if (inside(x, y, LAYOUT.serve)) return { kind: 'serve' };
  for (let i = 0; i < 3; i += 1) {
    if (inside(x, y, ticketRect(i))) return { kind: 'ticket', index: i };
  }
  return null;
}

/** Route a click at logical (x, y) to a world action. Returns true when the
 *  click did something. */
export function clickAt(world, x, y) {
  const s = world.state;
  if (s.screen === 'title') {
    world.startShift(1);
    return true;
  }
  if (s.screen === 'over') {
    world.toTitle();
    return true;
  }
  const hit = hitAt(x, y);
  if (!hit) return false;
  if (hit.kind === 'bin') return world.pickIngredient(hit.id);
  if (hit.kind === 'board') return world.useBoard();
  if (hit.kind === 'wok') return world.useWok();
  if (hit.kind === 'plate') {
    if (world.handReady()) return world.addToPlate();
    return world.clearPlate();
  }
  if (hit.kind === 'serve') {
    for (let i = 0; i < s.orders.length; i += 1) {
      if (s.orders[i] && s.orders[i].recipeId === s.readyDish) return world.serveOrder(i);
    }
    return false;
  }
  if (hit.kind === 'ticket') return world.serveOrder(hit.index);
  return false;
}

/** Route a keyboard key to a world action. Returns true when the key did something. */
export function keyDown(world, key) {
  const s = world.state;
  const k = key.toLowerCase();
  if (s.screen === 'title' && (k === 'enter' || k === ' ')) {
    world.startShift(1);
    return true;
  }
  if (s.screen === 'over' && (k === 'enter' || k === 'r' || k === ' ')) {
    world.toTitle();
    return true;
  }
  if (s.screen !== 'play') return false;
  const binIndex = INGREDIENTS.findIndex((ing) => ing.key === k);
  if (binIndex !== -1) return world.pickIngredient(INGREDIENTS[binIndex].id);
  if (k === 'c') return world.useBoard();
  if (k === 'k') return world.useWok();
  if (k === 'p') {
    if (world.handReady()) return world.addToPlate();
    return world.clearPlate();
  }
  if (k === 's') {
    for (let i = 0; i < s.orders.length; i += 1) {
      if (s.orders[i] && s.orders[i].recipeId === s.readyDish) return world.serveOrder(i);
    }
    return false;
  }
  if (k === 'r') {
    world.startShift(1);
    return true;
  }
  return false;
}
