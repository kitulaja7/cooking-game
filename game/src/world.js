// Dapur Senja — the game state and its rules. No drawing here, no input
// here: pure logic, stepped at a fixed rate, driven by a seeded RNG so the
// same seed always deals the same shift.
//
// The loop a cook repeats: pick an ingredient from a bin (1-6 or click),
// prep it (chop on the talenan, cook in the wok) when its recipe needs it,
// add it to the plate, and serve the finished dish to the matching order
// ticket before its timer runs out. Fast serves build a combo; a wrong
// serve costs 5 seconds off the shift clock; an expired order costs money.

import { FIELD, STEP, SHIFT_SECONDS, LEVEL_EVERY, ORDER, PREP, WRONG_PENALTY_SECONDS, EXPIRE_PENALTY, COMBO_BONUS } from './config.js';
import { ING_BY_ID, RECIPES, RECIPE_BY_ID, matchRecipe } from './recipes.js';
import { mulberry32, pick } from './rng.js';

/** A fresh, empty state. */
export function freshState() {
  return {
    screen: 'title',
    time: 0,
    shiftLeft: SHIFT_SECONDS,
    level: 1,
    money: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    lost: 0,
    wrong: 0,
    orders: [null, null, null],
    spawnIn: 1.2,
    hand: null,
    board: null,
    wok: null,
    plate: [],
    readyDish: null,
    toast: null,
    shakeTicket: -1,
    shakeTime: 0,
    serveFlash: 0,
    seed: 1,
  };
}

export class World {
  constructor(seed = 1) {
    this.state = freshState();
    this.rng = mulberry32(seed);
    this.seed = seed;
  }

  reset(seed = 1) {
    this.state = freshState();
    this.rng = mulberry32(seed);
    this.seed = seed;
  }

  /** Rush level from elapsed time: a new level every LEVEL_EVERY seconds. */
  levelAt(time) {
    return 1 + Math.floor(time / LEVEL_EVERY);
  }

  orderTimeFor(level) {
    return Math.max(ORDER.minTime, ORDER.baseTime + (level - 1) * ORDER.timePerLevel);
  }

  spawnIntervalFor(level) {
    return Math.max(ORDER.minSpawn, ORDER.spawnInterval + (level - 1) * ORDER.spawnPerLevel);
  }

  /** Deal one order into the first empty slot, if any. */
  spawnOrder() {
    const s = this.state;
    const slot = s.orders.indexOf(null);
    if (slot === -1) return false;
    const recipe = pick(this.rng, RECIPES);
    const time = this.orderTimeFor(s.level);
    s.orders[slot] = { recipeId: recipe.id, timeLeft: time, maxTime: time, born: s.time };
    return true;
  }

  startShift(seed = 1) {
    this.reset(seed);
    const s = this.state;
    s.screen = 'play';
    this.spawnOrder();
    this.spawnOrder();
    s.spawnIn = this.spawnIntervalFor(1);
  }

  /** What the hand is carrying, as a short label for the HUD. */
  handLabel() {
    const h = this.state.hand;
    if (!h) return null;
    const ing = ING_BY_ID[h.ing];
    if (h.stage === 'chopped') return ing.name + ' CINCANG';
    if (h.stage === 'cooked') return ing.name + ' MATANG';
    return ing.name;
  }

  /** Is the carried ingredient finished (ready to go on the plate)? */
  handReady() {
    const h = this.state.hand;
    if (!h) return false;
    const need = ING_BY_ID[h.ing].need;
    if (need === 'none') return h.stage === 'raw';
    if (need === 'chop') return h.stage === 'chopped';
    if (need === 'cook') return h.stage === 'cooked';
    return h.stage === 'cooked'; // chop+cook
  }

  /** Pick an ingredient from a bin. The hand holds one thing at a time. */
  pickIngredient(id) {
    const s = this.state;
    if (s.screen !== 'play' || s.hand) return false;
    if (!ING_BY_ID[id]) return false;
    s.hand = { ing: id, stage: 'raw' };
    return true;
  }

  /** Use the chopping board: put a choppable ingredient down, or chop the
   *  one already there (3 clicks). A finished chop returns to the hand. */
  useBoard() {
    const s = this.state;
    if (s.screen !== 'play') return false;
    if (s.board) {
      s.board.clicks += 1;
      if (s.board.clicks >= PREP.chopClicks) {
        s.hand = { ing: s.board.ing, stage: 'chopped' };
        s.board = null;
      }
      return true;
    }
    const h = s.hand;
    if (!h || h.stage !== 'raw') return false;
    const need = ING_BY_ID[h.ing].need;
    if (need !== 'chop' && need !== 'chop+cook') return false;
    s.board = { ing: h.ing, clicks: 0 };
    s.hand = null;
    return true;
  }

  /** Use the wok: put a cookable ingredient in, or take it out when done.
   *  Cooking runs on its own clock once the ingredient is in. */
  useWok() {
    const s = this.state;
    if (s.screen !== 'play') return false;
    if (s.wok) {
      if (s.wok.progress < 1) return false;
      s.hand = { ing: s.wok.ing, stage: 'cooked' };
      s.wok = null;
      return true;
    }
    const h = s.hand;
    if (!h) return false;
    const need = ING_BY_ID[h.ing].need;
    if (need === 'none') return false;
    if (need === 'chop' && h.stage !== 'chopped') return false;
    if (need === 'chop+cook' && h.stage !== 'chopped') return false;
    if (need === 'cook' && h.stage !== 'raw') return false;
    s.wok = { ing: h.ing, progress: 0 };
    s.hand = null;
    return true;
  }

  /** Add the carried, finished ingredient to the plate. */
  addToPlate() {
    const s = this.state;
    if (s.screen !== 'play' || !s.hand || !this.handReady()) return false;
    if (s.plate.length >= 4) return false;
    s.plate.push(s.hand.ing);
    s.hand = null;
    const match = matchRecipe(s.plate);
    s.readyDish = match ? match.id : null;
    return true;
  }

  /** Clear the plate (the cook made a mess). Costs nothing but the food. */
  clearPlate() {
    const s = this.state;
    if (s.screen !== 'play' || s.plate.length === 0) return false;
    s.plate = [];
    s.readyDish = null;
    return true;
  }

  /** Serve the finished dish to order slot `i`. */
  serveOrder(i) {
    const s = this.state;
    if (s.screen !== 'play') return false;
    const order = s.orders[i];
    if (!order || !s.readyDish) return false;
    if (order.recipeId !== s.readyDish) {
      s.wrong += 1;
      s.combo = 0;
      s.shiftLeft = Math.max(0, s.shiftLeft - WRONG_PENALTY_SECONDS);
      s.shakeTicket = i;
      s.shakeTime = 0.45;
      s.toast = { text: 'SALAH PESANAN!  -5 DETIK', color: '#d94f3d', t: 1.6 };
      return false;
    }
    const recipe = RECIPE_BY_ID[order.recipeId];
    s.combo += 1;
    s.bestCombo = Math.max(s.bestCombo, s.combo);
    const bonus = (s.combo - 1) * COMBO_BONUS;
    const pay = recipe.price + bonus;
    s.money += pay;
    s.score += pay;
    s.served += 1;
    s.serveFlash = 0.5;
    s.toast = {
      text: '+' + pay.toLocaleString('id-ID') + (s.combo > 1 ? '   KOMBO x' + s.combo + '!' : ''),
      color: '#4e9b47',
      t: 1.8,
    };
    s.orders[i] = null;
    s.plate = [];
    s.readyDish = null;
    s.spawnIn = Math.min(s.spawnIn, 0.8);
    return true;
  }

  /** Advance the simulation by `dt` seconds. */
  step(dt) {
    const s = this.state;
    if (s.screen !== 'play') return;
    s.time += dt;
    s.shiftLeft = Math.max(0, s.shiftLeft - dt);
    s.level = this.levelAt(s.time);
    if (s.toast) {
      s.toast.t -= dt;
      if (s.toast.t <= 0) s.toast = null;
    }
    if (s.shakeTime > 0) {
      s.shakeTime -= dt;
      if (s.shakeTime <= 0) s.shakeTicket = -1;
    }
    if (s.serveFlash > 0) s.serveFlash -= dt;
    if (s.wok) {
      s.wok.progress = Math.min(1, s.wok.progress + dt / PREP.cookSeconds);
    }
    for (let i = 0; i < s.orders.length; i += 1) {
      const order = s.orders[i];
      if (!order) continue;
      order.timeLeft -= dt;
      if (order.timeLeft <= 0) {
        s.orders[i] = null;
        s.lost += 1;
        s.combo = 0;
        s.money = Math.max(0, s.money - EXPIRE_PENALTY);
        s.toast = { text: 'PESANAN HANGUS!  -Rp 500', color: '#d94f3d', t: 1.6 };
        s.spawnIn = Math.min(s.spawnIn, 0.6);
      }
    }
    s.spawnIn -= dt;
    if (s.spawnIn <= 0) {
      if (this.spawnOrder()) s.spawnIn = this.spawnIntervalFor(s.level);
      else s.spawnIn = 1.0;
    }
    if (s.shiftLeft <= 0) {
      s.screen = 'over';
    }
  }

  /** Back to the title screen. */
  toTitle() {
    this.reset(this.seed);
  }
}
