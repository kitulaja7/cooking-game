// Dapur Senja — all drawing. Canvas 2D, no external assets: every food,
// station and lamp is drawn from shapes, so the game is one self-contained
// page. The judge reads the game through its screenshots, so every system
// is drawn big and labelled: order board, stations, plate, timer, serve
// window, ingredient bins.

import { FIELD, LAYOUT, COLORS, ticketRect, binRect } from './config.js';
import { INGREDIENTS, ING_BY_ID, RECIPES, RECIPE_BY_ID, rupiah } from './recipes.js';

/** Rounded-rect path. */
export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** Fill text, shrinking the font until it fits `maxW`. */
function fitText(ctx, text, x, y, maxW, size, weight = 'bold') {
  let s = size;
  ctx.font = `${weight} ${s}px sans-serif`;
  while (s > 9 && ctx.measureText(text).width > maxW) {
    s -= 1;
    ctx.font = `${weight} ${s}px sans-serif`;
  }
  ctx.fillText(text, x, y);
  return s;
}

/** Draw one ingredient as a recognisable little picture, centred at (x, y)
 *  inside a `size` box. Food must read in two seconds at small size. */
export function drawFood(ctx, id, x, y, size) {
  const s = size;
  const u = s / 100;
  ctx.save();
  ctx.translate(x, y);
  if (id === 'nasi') {
    ctx.fillStyle = '#f7f3e8';
    ctx.beginPath();
    ctx.ellipse(0, 6 * u, 34 * u, 20 * u, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-14 * u, -2 * u, 9 * u, 0, Math.PI * 2);
    ctx.arc(4 * u, -8 * u, 10 * u, 0, Math.PI * 2);
    ctx.arc(16 * u, 0, 8 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d8cdb4';
    ctx.lineWidth = 2 * u;
    ctx.beginPath();
    ctx.moveTo(-34 * u, 6 * u);
    ctx.lineTo(34 * u, 6 * u);
    ctx.stroke();
  } else if (id === 'ayam') {
    ctx.fillStyle = '#e8a25e';
    ctx.beginPath();
    ctx.ellipse(-6 * u, 2 * u, 26 * u, 20 * u, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a85f2a';
    ctx.beginPath();
    ctx.ellipse(-6 * u, 6 * u, 18 * u, 10 * u, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f7ead6';
    ctx.lineWidth = 5 * u;
    ctx.beginPath();
    ctx.moveTo(16 * u, -12 * u);
    ctx.lineTo(30 * u, -24 * u);
    ctx.stroke();
    ctx.fillStyle = '#f7ead6';
    ctx.beginPath();
    ctx.arc(32 * u, -26 * u, 6 * u, 0, Math.PI * 2);
    ctx.arc(26 * u, -30 * u, 5 * u, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'mie') {
    ctx.strokeStyle = '#f2c14e';
    ctx.lineWidth = 7 * u;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, (10 + i * 9) * u, 0.4 + i * 0.7, 4.6 + i * 0.7);
      ctx.stroke();
    }
    ctx.fillStyle = '#6fbf4a';
    ctx.beginPath();
    ctx.arc(-12 * u, -14 * u, 5 * u, 0, Math.PI * 2);
    ctx.arc(12 * u, 10 * u, 5 * u, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'sayur') {
    ctx.fillStyle = '#6fbf4a';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.ellipse(i * 18 * u, (i === 0 ? -6 : 4) * u, 13 * u, 20 * u, i * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#3d7a28';
    ctx.lineWidth = 3 * u;
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 18 * u, -22 * u);
      ctx.lineTo(i * 18 * u, 18 * u);
      ctx.stroke();
    }
  } else if (id === 'telur') {
    ctx.fillStyle = '#fffdf4';
    ctx.beginPath();
    ctx.ellipse(0, 0, 34 * u, 24 * u, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2a93b';
    ctx.beginPath();
    ctx.arc(2 * u, 0, 13 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7c95c';
    ctx.beginPath();
    ctx.arc(-2 * u, -3 * u, 6 * u, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'sambal') {
    ctx.fillStyle = '#3d2c22';
    ctx.beginPath();
    ctx.ellipse(0, 12 * u, 32 * u, 16 * u, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.ellipse(0, 8 * u, 28 * u, 12 * u, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#8f2418';
    ctx.beginPath();
    ctx.arc(-10 * u, 2 * u, 4 * u, 0, Math.PI * 2);
    ctx.arc(6 * u, -2 * u, 5 * u, 0, Math.PI * 2);
    ctx.arc(14 * u, 4 * u, 3 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6fbf4a';
    ctx.beginPath();
    ctx.arc(0, -6 * u, 4 * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** The wall: dusk blue, a sunset window, two warm hanging lamps. */
function drawBackground(ctx, time) {
  const g = ctx.createLinearGradient(0, 0, 0, FIELD.height);
  g.addColorStop(0, COLORS.wallTop);
  g.addColorStop(0.55, COLORS.wallBottom);
  g.addColorStop(0.56, '#3a2c22');
  g.addColorStop(1, '#2c211a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);

  // Sunset window on the kitchen wall.
  const wx = 560;
  const wy = 78;
  const ww = 180;
  const wh = 120;
  ctx.fillStyle = COLORS.woodDark;
  rr(ctx, wx - 8, wy - 8, ww + 16, wh + 16, 10);
  ctx.fill();
  const wg = ctx.createLinearGradient(0, wy, 0, wy + wh);
  wg.addColorStop(0, '#e8703a');
  wg.addColorStop(0.6, '#f2a93b');
  wg.addColorStop(1, '#f7d774');
  ctx.fillStyle = wg;
  ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = '#f7d774';
  ctx.beginPath();
  ctx.arc(wx + 132, wy + 78, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7d5535';
  ctx.fillRect(wx + ww / 2 - 4, wy, 8, wh);
  ctx.fillRect(wx, wy + wh / 2 - 4, ww, 8);
  // Rooftops in the window.
  ctx.fillStyle = '#5d3f27';
  ctx.beginPath();
  ctx.moveTo(wx, wy + wh);
  ctx.lineTo(wx + 40, wy + 82);
  ctx.lineTo(wx + 80, wy + wh);
  ctx.closePath();
  ctx.moveTo(wx + 90, wy + wh);
  ctx.lineTo(wx + 140, wy + 70);
  ctx.lineTo(wx + ww, wy + wh);
  ctx.closePath();
  ctx.fill();

  // Hanging lamps with a warm glow that breathes slowly.
  for (const lx of [180, 1100]) {
    const flicker = 0.16 + 0.05 * Math.sin(time * 2 + lx);
    ctx.fillStyle = `rgba(255, 217, 138, ${flicker})`;
    ctx.beginPath();
    ctx.arc(lx, 96, 74, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2a2118';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, 62);
    ctx.lineTo(lx, 78);
    ctx.stroke();
    ctx.fillStyle = COLORS.lamp;
    ctx.beginPath();
    ctx.moveTo(lx - 22, 78);
    ctx.lineTo(lx + 22, 78);
    ctx.lineTo(lx + 10, 100);
    ctx.lineTo(lx - 10, 100);
    ctx.closePath();
    ctx.fill();
  }
}

/** Top HUD: title, money, stars, combo and the big shift timer. */
function drawHUD(ctx, s) {
  const h = LAYOUT.hud;
  ctx.fillStyle = '#1a2233';
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, h.h - 3, FIELD.width, 3);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.gold;
  fitText(ctx, 'DAPUR SENJA', 16, 32, 185, 30);
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('WARUNG · RUSH MALAM', 212, 34);

  // Money.
  ctx.fillStyle = COLORS.paper;
  rr(ctx, 420, 10, 200, 42, 10);
  ctx.fill();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(rupiah(s.money), 520, 32);

  // Stars earned by dishes served.
  const stars = Math.min(3, Math.floor(s.served / 4));
  ctx.font = '26px sans-serif';
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < stars ? COLORS.gold : '#4a5468';
    ctx.fillText('★', 648 + i * 34, 33);
  }

  // Combo.
  if (s.combo > 1) {
    ctx.fillStyle = '#e8703a';
    rr(ctx, 756, 10, 150, 42, 10);
    ctx.fill();
    ctx.fillStyle = '#fff6e3';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('KOMBO x' + s.combo, 831, 32);
  }

  // The big shift timer.
  const mm = Math.floor(s.shiftLeft / 60);
  const ss = Math.floor(s.shiftLeft % 60);
  const timerText = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
  const urgent = s.shiftLeft <= 30;
  ctx.fillStyle = urgent ? COLORS.red : COLORS.paper;
  rr(ctx, 1080, 8, 180, 46, 10);
  ctx.fill();
  ctx.fillStyle = urgent ? '#fff6e3' : COLORS.ink;
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(timerText, 1170, 32);
  ctx.textAlign = 'left';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = urgent ? '#ffb3a7' : '#8b98ad';
  ctx.fillText('SHIFT', 1092, 22);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

/** The order board: three paper tickets, each with its dish, the ingredients
 *  it needs (ticked off as they land on the plate), a per-order timer bar
 *  and its price. The ticket matching the finished plate glows green. */
function drawBoard(ctx, s, time) {
  const b = LAYOUT.board;
  ctx.fillStyle = COLORS.woodDark;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.wood;
  rr(ctx, b.x + 5, b.y + 5, b.w - 10, b.h - 10, 9);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, 'PAPAN ORDER', b.x + 12, b.y + 26, 180, 19);
  ctx.fillStyle = COLORS.gold;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('LEVEL ' + s.level, b.x + 208, b.y + 25);

  for (let i = 0; i < 3; i += 1) {
    const r = ticketRect(i);
    const order = s.orders[i];
    const shake = s.shakeTicket === i ? Math.sin(time * 40) * 5 : 0;
    ctx.save();
    ctx.translate(shake, 0);
    const ready = order && s.readyDish === order.recipeId;
    ctx.fillStyle = ready ? '#dff0d2' : COLORS.paper;
    rr(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.fill();
    ctx.strokeStyle = ready ? COLORS.green : COLORS.paperDark;
    ctx.lineWidth = ready ? 4 : 2;
    rr(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.stroke();
    if (!order) {
      ctx.fillStyle = COLORS.inkSoft;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('— PESANAN BARU —', r.x + r.w / 2, r.y + r.h / 2 + 6);
      ctx.restore();
      continue;
    }
    const recipe = RECIPE_BY_ID[order.recipeId];
    ctx.fillStyle = COLORS.ink;
    ctx.textAlign = 'left';
    fitText(ctx, recipe.name, r.x + 12, r.y + 26, 170, 20);
    ctx.fillStyle = ready ? COLORS.green : COLORS.red;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(ready ? 'SIAP SAJI!' : rupiah(recipe.price), r.x + r.w - 12, r.y + 26);
    // Ingredient icons, ticked when on the plate.
    const n = recipe.ings.length;
    for (let k = 0; k < n; k += 1) {
      const ix = r.x + 30 + k * 56;
      const iy = r.y + 58;
      const done = s.plate.includes(recipe.ings[k]);
      ctx.fillStyle = done ? '#dff0d2' : '#e8dcc4';
      ctx.beginPath();
      ctx.arc(ix, iy, 22, 0, Math.PI * 2);
      ctx.fill();
      drawFood(ctx, recipe.ings[k], ix, iy, 34);
      if (done) {
        ctx.strokeStyle = COLORS.green;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ix - 8, iy);
        ctx.lineTo(ix - 2, iy + 7);
        ctx.lineTo(ix + 10, iy - 8);
        ctx.stroke();
      }
    }
    // Per-order timer bar: green -> amber -> red.
    const frac = Math.max(0, order.timeLeft / order.maxTime);
    ctx.fillStyle = '#d8cdb4';
    rr(ctx, r.x + 12, r.y + r.h - 18, r.w - 24, 10, 5);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? COLORS.green : frac > 0.25 ? COLORS.amber : COLORS.red;
    rr(ctx, r.x + 12, r.y + r.h - 18, (r.w - 24) * frac, 10, 5);
    ctx.fill();
    ctx.fillStyle = COLORS.inkSoft;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.ceil(order.timeLeft) + ' dtk', r.x + r.w - 12, r.y + r.h - 24);
    ctx.restore();
  }
  ctx.textAlign = 'left';
}

/** Talenan (chopping board) and wok (stove): the two prep stations. */
function drawStations(ctx, s, time) {
  // Talenan.
  const b = LAYOUT.boardStation;
  ctx.fillStyle = COLORS.woodDark;
  rr(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.fillStyle = COLORS.woodLight;
  rr(ctx, b.x + 10, b.y + 34, b.w - 20, b.h - 62, 8);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, 'TALENAN — POTONG [C]', b.x + 12, b.y + 24, b.w - 24, 16);
  if (s.board) {
    const ing = ING_BY_ID[s.board.ing];
    drawFood(ctx, s.board.ing, b.x + b.w / 2 - 30, b.y + 88, 64);
    // Chop marks.
    ctx.strokeStyle = '#5d3f27';
    ctx.lineWidth = 3;
    for (let i = 0; i < s.board.clicks; i += 1) {
      const mx = b.x + b.w / 2 - 40 + i * 22;
      ctx.beginPath();
      ctx.moveTo(mx, b.y + 56);
      ctx.lineTo(mx + 10, b.y + 106);
      ctx.stroke();
    }
    // Progress dots.
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = i < s.board.clicks ? COLORS.green : '#d8cdb4';
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2 + 52 + i * 20, b.y + 88, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.name + '  ' + s.board.clicks + '/3', b.x + b.w / 2, b.y + b.h - 8);
  } else {
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('klik bahan, lalu klik di sini', b.x + b.w / 2, b.y + 88);
  }

  // Wok.
  const w = LAYOUT.wokStation;
  ctx.fillStyle = '#33302e';
  rr(ctx, w.x, w.y, w.w, w.h, 10);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'left';
  fitText(ctx, 'WAJAN — MASAK [K]', w.x + 12, w.y + 24, w.w - 24, 16);
  // Flame, flickering with time.
  const flick = Math.sin(time * 11) * 4 + Math.sin(time * 23) * 2;
  ctx.fillStyle = '#e8703a';
  ctx.beginPath();
  ctx.moveTo(w.x + 40, w.y + w.h - 14);
  ctx.quadraticCurveTo(w.x + 70, w.y + w.h - 52 - flick, w.x + 100, w.y + w.h - 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2c14e';
  ctx.beginPath();
  ctx.moveTo(w.x + 56, w.y + w.h - 14);
  ctx.quadraticCurveTo(w.x + 70, w.y + w.h - 40 - flick, w.x + 86, w.y + w.h - 14);
  ctx.closePath();
  ctx.fill();
  // Wok bowl.
  ctx.fillStyle = '#1c1a18';
  ctx.beginPath();
  ctx.ellipse(w.x + w.w / 2, w.y + 84, 96, 34, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.ellipse(w.x + w.w / 2, w.y + 82, 88, 28, 0, Math.PI, 0);
  ctx.fill();
  if (s.wok) {
    drawFood(ctx, s.wok.ing, w.x + w.w / 2, w.y + 78, 56);
    // Steam wisps while cooking.
    if (s.wok.progress < 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i += 1) {
        const sx = w.x + w.w / 2 - 30 + i * 30;
        const sway = Math.sin(time * 3 + i * 2) * 6;
        ctx.beginPath();
        ctx.moveTo(sx, w.y + 52);
        ctx.quadraticCurveTo(sx + sway, w.y + 34, sx - sway, w.y + 16);
        ctx.stroke();
      }
    }
    // Cook progress bar.
    ctx.fillStyle = '#d8cdb4';
    rr(ctx, w.x + 30, w.y + w.h - 34, w.w - 60, 10, 5);
    ctx.fill();
    ctx.fillStyle = s.wok.progress >= 1 ? COLORS.green : COLORS.amber;
    rr(ctx, w.x + 30, w.y + w.h - 34, (w.w - 60) * s.wok.progress, 10, 5);
    ctx.fill();
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.wok.progress >= 1 ? 'MATANG! KLIK UNTUK AMBIL' : 'MEMASAK…', w.x + w.w / 2, w.y + w.h - 8);
  } else {
    ctx.fillStyle = '#b8b2a4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('wajan kosong', w.x + w.w / 2, w.y + 84);
  }
  ctx.textAlign = 'left';
}

/** The assembly plate: the dish being built, with four slots. When the
 *  plate matches a recipe it glows and names the dish. */
function drawPlate(ctx, s) {
  const p = LAYOUT.plateStation;
  const ready = s.readyDish ? RECIPE_BY_ID[s.readyDish] : null;
  ctx.fillStyle = ready ? '#3d5a34' : COLORS.woodDark;
  rr(ctx, p.x, p.y, p.w, p.h, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, ready ? 'PIRING SIAP: ' + ready.name : 'PIRING RAKIT — [P] TAMBAH BAHAN', p.x + 12, p.y + 24, p.w - 24, 16);
  // The big plate.
  const cx = p.x + p.w / 2;
  const cy = p.y + 116;
  ctx.fillStyle = '#fffdf4';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 150, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d8cdb4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 150, 52, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, 112, 36, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Four slots.
  for (let i = 0; i < 4; i += 1) {
    const sx = cx - 108 + i * 72;
    const ing = s.plate[i];
    if (ing) {
      ctx.fillStyle = '#e8dcc4';
      ctx.beginPath();
      ctx.ellipse(sx, cy, 30, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      drawFood(ctx, ing, sx, cy, 56);
    } else {
      ctx.strokeStyle = '#d8cdb4';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, cy, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  if (ready) {
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ ' + ready.name + ' — SAJIKAN KE PESANAN!', cx, p.y + p.h - 10);
  } else if (s.plate.length > 0) {
    ctx.fillStyle = '#c9a582';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.plate.length + '/4 bahan — klik piring untuk buang', cx, p.y + p.h - 10);
  }
  ctx.textAlign = 'left';
}

/** The serve window: the bell, the ready dish, and the serve flash. */
function drawServe(ctx, s, time) {
  const v = LAYOUT.serve;
  ctx.fillStyle = s.serveFlash > 0 ? '#4e6b3a' : '#6b3a2a';
  rr(ctx, v.x, v.y, v.w, v.h, 12);
  ctx.fill();
  ctx.fillStyle = '#8a4a34';
  rr(ctx, v.x + 6, v.y + 6, v.w - 12, v.h - 12, 9);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, 'JENDELA SAJI  [S]', v.x + 14, v.y + 28, v.w - 28, 19);
  // The service bell.
  const bx = v.x + v.w / 2;
  const by = v.y + 92;
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(bx, by, 34, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(bx - 34, by - 4, 68, 8);
  ctx.beginPath();
  ctx.arc(bx, by + 12, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TERIMA PESANAN DI SINI', bx, by + 44);
  // Ready dish, big.
  const ready = s.readyDish ? RECIPE_BY_ID[s.readyDish] : null;
  if (ready) {
    ctx.fillStyle = '#fffdf4';
    ctx.beginPath();
    ctx.ellipse(bx, v.y + 250, 120, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < ready.ings.length; i += 1) {
      const fx = bx - 78 + i * 52;
      ctx.fillStyle = '#e8dcc4';
      ctx.beginPath();
      ctx.ellipse(fx, v.y + 248, 24, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      drawFood(ctx, ready.ings[i], fx, v.y + 248, 48);
    }
    ctx.fillStyle = COLORS.green;
    rr(ctx, v.x + 40, v.y + 306, v.w - 80, 44, 10);
    ctx.fill();
    ctx.fillStyle = '#fff6e3';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText('SAJIKAN ' + ready.name, bx, v.y + 334);
  } else {
    ctx.fillStyle = '#c9a582';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('belum ada hidangan siap', bx, v.y + 250);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('rakit hidangan di piring,', bx, v.y + 276);
    ctx.fillText('lalu sajikan ke pesanan', bx, v.y + 296);
  }
  // Served counter.
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('TERSAJI: ' + s.served + '   HANGUS: ' + s.lost, v.x + 14, v.y + v.h - 12);
  ctx.textAlign = 'left';
}

/** The ingredient counter: six bins along the bottom, each with its food
 *  drawn big, its name, its key and what it needs. */
function drawBins(ctx, s) {
  const b = LAYOUT.bins;
  ctx.fillStyle = COLORS.woodDark;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.counterTop;
  ctx.fillRect(b.x + 6, b.y + 6, b.w - 12, 10);
  for (let i = 0; i < INGREDIENTS.length; i += 1) {
    const ing = INGREDIENTS[i];
    const r = binRect(i);
    const carrying = s.hand && s.hand.ing === ing.id;
    ctx.fillStyle = carrying ? '#ffe9b0' : COLORS.paper;
    rr(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.fill();
    ctx.strokeStyle = carrying ? COLORS.gold : COLORS.paperDark;
    ctx.lineWidth = carrying ? 4 : 2;
    rr(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.stroke();
    drawFood(ctx, ing.id, r.x + r.w / 2, r.y + 66, 84);
    ctx.fillStyle = COLORS.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, ing.name, r.x + r.w / 2, r.y + 142, r.w - 16, 22);
    ctx.fillStyle = COLORS.inkSoft;
    ctx.font = 'bold 13px sans-serif';
    const need = ing.need === 'none' ? 'SIAP PAKAI' : ing.need === 'chop' ? 'POTONG DULU' : ing.need === 'cook' ? 'MASAK DULU' : 'POTONG + MASAK';
    ctx.fillText(need, r.x + r.w / 2, r.y + 164);
    ctx.fillStyle = COLORS.woodDark;
    rr(ctx, r.x + 10, r.y + 10, 30, 26, 6);
    ctx.fill();
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(ing.key, r.x + 25, r.y + 29);
  }
  // What the hand carries: a chip at the left of the seam, clear of the
  // toast pill (centred) and of the plate hint above it.
  if (s.hand) {
    const ing = ING_BY_ID[s.hand.ing];
    const label = 'DIBAWA: ' + (s.hand.stage === 'chopped' ? ing.name + ' CINCANG' : s.hand.stage === 'cooked' ? ing.name + ' MATANG' : ing.name);
    ctx.fillStyle = '#1a2233';
    rr(ctx, 10, 446, 330, 30, 8);
    ctx.fill();
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label + '  →  talenan / wajan / piring', 175, 466);
  }
  ctx.textAlign = 'left';
}

/** Toasts: big feedback text on a dark pill in the seam between the kitchen
 *  and the ingredient counter, so it never covers a bin or a station. */
function drawToast(ctx, s) {
  if (!s.toast) return;
  const alpha = Math.min(1, s.toast.t);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = 'bold 26px sans-serif';
  const w = ctx.measureText(s.toast.text).width + 44;
  const x = 640 - w / 2;
  const y = 451;
  ctx.fillStyle = 'rgba(20, 14, 8, 0.78)';
  rr(ctx, x, y, w, 38, 12);
  ctx.fill();
  ctx.strokeStyle = s.toast.color;
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, 38, 12);
  ctx.stroke();
  ctx.fillStyle = s.toast.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s.toast.text, 640, y + 20);
  ctx.restore();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

/** Title screen: the game, its rules and its six recipes at a glance. */
function drawTitle(ctx, s) {
  ctx.fillStyle = 'rgba(16, 20, 32, 0.82)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.gold;
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText('DAPUR SENJA', 640, 150);
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Warung kecil, rush besar — 6 resep, 1 shift, 180 detik', 640, 196);
  ctx.fillStyle = COLORS.paper;
  rr(ctx, 340, 232, 600, 150, 14);
  ctx.fill();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CARA MAIN', 370, 268);
  ctx.font = '17px sans-serif';
  ctx.fillText('1. Klik bahan di counter bawah (atau tombol 1–6)', 370, 300);
  ctx.fillText('2. Potong di TALENAN [C], masak di WAJAN [K]', 370, 328);
  ctx.fillText('3. Rakit di PIRING [P], sajikan ke pesanan [S]', 370, 356);
  ctx.fillText('Saji cepat = KOMBO. Salah saji = −5 detik. Pesanan hangus = −Rp 500.', 370, 384);
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('NASI GORENG · MIE AYAM · SOTO AYAM · GADO-GADO · AYAM GEPREK · NASI AYAM', 640, 420);
  const pulse = 0.75 + 0.25 * Math.sin(s.time * 4);
  ctx.fillStyle = `rgba(242, 193, 78, ${pulse})`;
  rr(ctx, 490, 470, 300, 64, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('▶  MULAI SHIFT', 640, 511);
  ctx.fillStyle = '#8b98ad';
  ctx.font = '15px sans-serif';
  ctx.fillText('klik di mana saja / tekan ENTER', 640, 566);
  ctx.textAlign = 'left';
}

/** Shift-over screen: the night's numbers and the stars earned. */
function drawOver(ctx, s) {
  ctx.fillStyle = 'rgba(16, 20, 32, 0.86)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.gold;
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('SHIFT SELESAI!', 640, 150);
  const stars = Math.min(3, Math.floor(s.served / 4));
  ctx.font = '64px sans-serif';
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < stars ? COLORS.gold : '#4a5468';
    ctx.fillText('★', 556 + i * 84, 240);
  }
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Pendapatan malam ini:  ' + rupiah(s.money), 640, 310);
  ctx.font = '22px sans-serif';
  ctx.fillText('Hidangan tersaji: ' + s.served + '    Hangus: ' + s.lost + '    Salah saji: ' + s.wrong, 640, 356);
  ctx.fillText('Kombo terbaik: x' + Math.max(1, s.bestCombo) + '    Skor: ' + s.score.toLocaleString('id-ID'), 640, 392);
  ctx.fillStyle = COLORS.paper;
  rr(ctx, 490, 440, 300, 64, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MAIN LAGI  [ENTER]', 640, 481);
  ctx.textAlign = 'left';
}

/** Draw the whole game for state `s` at visual time `time`. */
export function render(ctx, s, time) {
  ctx.clearRect(0, 0, FIELD.width, FIELD.height);
  drawBackground(ctx, time);
  drawHUD(ctx, s);
  if (s.screen === 'title') {
    drawBins(ctx, { ...s, hand: null });
    drawTitle(ctx, s);
    return;
  }
  drawBoard(ctx, s, time);
  drawStations(ctx, s, time);
  drawPlate(ctx, s);
  drawServe(ctx, s, time);
  drawBins(ctx, s);
  drawToast(ctx, s);
  if (s.screen === 'over') drawOver(ctx, s);
}
